import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LayoutUiService } from '../../../services/layout-ui.service';
import { memberIcons } from '../../member-icons';
import { SpinScheduleService } from '../../../services/spin-schedule.service';

interface User {
  id: string;
  name: string;
}

interface CashDrop {
  left: string;
  delay: string;
  duration: string;
  drift: string;
  rotate: string;
}

@Component({
  standalone: true,
  selector: 'app-spin-wheel',
  imports: [NgIf, NgFor, FontAwesomeModule],
  templateUrl: './spin-wheel.component.html',
  styleUrls: ['./spin-wheel.component.scss']
})
export class SpinWheelComponent implements OnDestroy, OnInit {
  readonly spinIcon = memberIcons.spin;
  readonly rewardIcon = memberIcons.reward;
  readonly scheduleIcon = memberIcons.schedule;
  accessBlocked = false;
  showAccessBlockedPopup = false;
  accessBlockedWaitTime = '';
  accessBlockedDateText = '';
  currentUserId = '';
  private accessBlockedTimerId: number | null = null;
  private hasAutoStartedSpin = false;
  private autoStartSpinAfterEntryCountdown = false;

  constructor(
    private readonly router: Router,
    private readonly layoutUi: LayoutUiService,
    private readonly authService: AuthService,
    private readonly spinScheduleService: SpinScheduleService
  ) {}
  users: User[] = [];
  usersLoading = true;
  usersError = '';

  winner: User | null = null;
  message = '';
  showEntryOverlay = true;
  showEntrySpinner = true;
  entryCountdownValue = 3;

  wheelAngle = 0;
  isRolling = false;
  isSpinPreparing = false;
  showWinnerPopup = false;
  showSpinStartNotice = false;

  lotSlots: string[] = ['U', 'S', 'M', '0', '0', '0', '0', '0'];
  private targetLotDigits: string[] | null = null;
  private lotIntervalId: number | null = null;
  private audioContext: AudioContext | null = null;
  private spinSoundTimerId: number | null = null;
  private spinStartNoticeTimerId: number | null = null;
  private entrySpinnerTimerId: number | null = null;
  private entryCountdownTimerId: number | null = null;
  private spinAmbientOscillator: OscillatorNode | null = null;
  private spinAmbientGain: GainNode | null = null;
  private spinTickCount = 0;
  private previousBodyOverflowY: string | null = null;
  private readonly spinDurationMs = 30000;
  private readonly spinSlowPhaseStartMs = 25000;
  private readonly entrySpinnerDurationMs = 1400;
  private readonly entryCountdownStepMs = 1000;
  readonly rimBulbCount = 32;
  readonly rimBulbs = Array.from({ length: this.rimBulbCount }, (_, i) => i);

  readonly cashDrops: CashDrop[] = [
    { left: '2%', delay: '0s', duration: '2.8s', drift: '-20px', rotate: '-14deg' },
    { left: '7%', delay: '0.4s', duration: '3.2s', drift: '16px', rotate: '11deg' },
    { left: '12%', delay: '0.9s', duration: '3s', drift: '-14px', rotate: '-9deg' },
    { left: '17%', delay: '0.2s', duration: '2.7s', drift: '22px', rotate: '15deg' },
    { left: '23%', delay: '0.6s', duration: '3.4s', drift: '-18px', rotate: '-12deg' },
    { left: '29%', delay: '0.1s', duration: '2.9s', drift: '20px', rotate: '10deg' },
    { left: '34%', delay: '0.8s', duration: '3.1s', drift: '-15px', rotate: '-8deg' },
    { left: '39%', delay: '0.5s', duration: '2.6s', drift: '18px', rotate: '12deg' },
    { left: '45%', delay: '0.3s', duration: '3.3s', drift: '-20px', rotate: '-16deg' },
    { left: '50%', delay: '1s', duration: '2.8s', drift: '14px', rotate: '9deg' },
    { left: '56%', delay: '0.2s', duration: '3.5s', drift: '-17px', rotate: '-11deg' },
    { left: '61%', delay: '0.7s', duration: '2.7s', drift: '22px', rotate: '14deg' },
    { left: '66%', delay: '0.4s', duration: '3.2s', drift: '-16px', rotate: '-10deg' },
    { left: '71%', delay: '0.9s', duration: '2.9s', drift: '19px', rotate: '13deg' },
    { left: '76%', delay: '0.15s', duration: '3.4s', drift: '-22px', rotate: '-15deg' },
    { left: '81%', delay: '0.65s', duration: '2.8s', drift: '16px', rotate: '10deg' },
    { left: '86%', delay: '0.25s', duration: '3.1s', drift: '-14px', rotate: '-9deg' },
    { left: '91%', delay: '0.85s', duration: '2.6s', drift: '20px', rotate: '12deg' },
    { left: '95%', delay: '0.45s', duration: '3.3s', drift: '-18px', rotate: '-12deg' },
    { left: '98%', delay: '1.1s', duration: '2.9s', drift: '15px', rotate: '8deg' }
  ];

  private readonly staticUsers: User[] = [
    { id: 'USM78250', name: 'Biruntha' },
    { id: 'USM71295', name: 'Manikandan' },
    { id: 'USM79580', name: 'Mozhi K' },
    { id: 'USM71504', name: 'SIVA KUMAR R' },
    { id: 'USM74058', name: 'Sindhuja siva' },
    { id: 'USM75340', name: 'Sonika.k' },
    { id: 'USM75213', name: 'Sashvath.k' },
    { id: 'USM75114', name: 'Sivaranjini' },
    { id: 'USM71079', name: 'M SHANKAR' },
    { id: 'USM74008', name: 'Santhosh T' },
    { id: 'USM73832', name: 'Tamilarasi c' },
    { id: 'USM77163', name: 'Pasuvaraj' },
    { id: 'USM76253', name: 'MANIVANNAN' },
    { id: 'USM77092', name: 'Maheshwari R' },
    { id: 'USM78438', name: 'SOUNDHAR RAJAN C' },
    { id: 'USM73690', name: 'Vidhya N' },
    { id: 'USM77335', name: 'KIRUBAKARAN R' },
    { id: 'USM76268', name: 'DHANASEKARAN G' },
    { id: 'USM73347', name: 'ESHWARAN G' },
    { id: 'USM71135', name: 'HEMAVARSHINI' }
  ];

  private readonly previousWinnerIds = new Set<string>([]);

  readonly winnerStars = Array.from({ length: 10 }, (_, i) => i);

  get canRoll(): boolean {
    return !this.accessBlocked && !this.isRolling && !this.isSpinPreparing;
  }

  get sliceAngle(): number {
    if (!this.users.length) {
      return 0;
    }
    return 360 / this.users.length;
  }

  get wheelGradient(): string {
    if (!this.users.length) {
      return 'conic-gradient(#0a0a0a 0deg 360deg)';
    }
    // Black-dominant slices with very subtle warm accents.
    const palette = ['#050505', '#0c0c0c', '#151107', '#090909', '#111111'];
    const slice = 360 / this.users.length;
    const segments: string[] = [];
    this.users.forEach((_, index) => {
      const start = index * slice;
      const end = start + slice;
      segments.push(`${palette[index % palette.length]} ${start}deg ${end}deg`);
    });
    return `conic-gradient(${segments.join(', ')})`;
  }

  get wheelDividerGradient(): string {
    if (!this.users.length) {
      return 'none';
    }
    const segment = 360 / this.users.length;
    return `repeating-conic-gradient(from 0deg, rgba(255, 217, 120, 0.32) 0deg 1deg, transparent 1deg ${segment}deg)`;
  }

  isPreviousWinner(user: User): boolean {
    return this.previousWinnerIds.has(user.id.trim().toUpperCase());
  }

  ngOnInit(): void {
    this.applySpinPageBodyOverflowLock();
    this.currentUserId = this.authService.getCurrentUser()?.userId.trim().toUpperCase() ?? '';
    this.loadGroupUsers();
    this.checkSpinAvailability();
    if (this.accessBlocked) {
      this.showEntryOverlay = false;
      this.showEntrySpinner = false;
      this.startAccessBlockedCountdown();
      return;
    }
    this.startEntrySequence();
  }

  private checkSpinAvailability(): void {
    const spinSchedule = this.spinScheduleService.getSpinSchedule(this.authService.getCurrentUser());
    this.accessBlocked = !spinSchedule.isAvailable;

    if (!this.accessBlocked) {
      this.accessBlockedWaitTime = '';
      this.accessBlockedDateText = spinSchedule.dateText;
      this.showAccessBlockedPopup = false;
      if (this.message.startsWith('Spin wheel unlocks in')) {
        this.message = '';
      }
      return;
    }

    this.accessBlockedWaitTime = spinSchedule.remainingText;
    this.accessBlockedDateText = spinSchedule.dateText;
    this.showAccessBlockedPopup = true;
    this.message = `Exclusive spin access unlocking soon. Unlocks in ${spinSchedule.remainingText}.`;
  }

  private startAccessBlockedCountdown(): void {
    if (this.accessBlockedTimerId !== null) {
      window.clearInterval(this.accessBlockedTimerId);
      this.accessBlockedTimerId = null;
    }

    this.accessBlockedTimerId = window.setInterval(() => {
      const wasBlocked = this.accessBlocked;
      this.checkSpinAvailability();

      if (wasBlocked && !this.accessBlocked) {
        this.showAccessBlockedPopup = false;
        if (this.accessBlockedTimerId !== null) {
          window.clearInterval(this.accessBlockedTimerId);
          this.accessBlockedTimerId = null;
        }

        if (!this.hasAutoStartedSpin) {
          this.hasAutoStartedSpin = true;
          this.autoStartSpinAfterEntryCountdown = true;
          this.startEntrySequence();
        }
      }
    }, 1000);
  }

  private applySpinPageBodyOverflowLock(): void {
    if (typeof document === 'undefined') {
      return;
    }

    this.previousBodyOverflowY = document.body.style.overflowY;
    document.body.style.overflowY = 'hidden';
  }

  private loadGroupUsers(): void {
    this.usersLoading = true;
    this.usersError = '';
    this.users = this.staticUsers.map((user) => ({ ...user }));
    this.usersLoading = false;
    if (!this.users.length) {
      this.usersError = 'No participants found.';
    }
  }

  roll(): void {
    this.checkSpinAvailability();

    if (this.accessBlocked) {
      this.showAccessBlockedPopup = true;
      this.showWinnerPopup = false;
      return;
    }

    if (!this.canRoll) {
      this.message = 'Roll is already in progress.';
      return;
    }

    this.isSpinPreparing = true;
    this.showSpinStartNotice = true;
    this.layoutUi.setSidebarCollapsed(true);
    void this.enterFullscreen();

    if (this.spinStartNoticeTimerId !== null) {
      window.clearTimeout(this.spinStartNoticeTimerId);
      this.spinStartNoticeTimerId = null;
    }

    this.spinStartNoticeTimerId = window.setTimeout(() => {
      this.showSpinStartNotice = false;
      this.isSpinPreparing = false;
      this.startSpin();
      this.spinStartNoticeTimerId = null;
    }, 1000);
  }

  private startSpin(): void {
    if (this.isRolling) {
      return;
    }

    this.showWinnerPopup = false;
    this.isRolling = true;
    this.winner = null;
    this.targetLotDigits = null;
    this.message = 'Fetching winner from server...';
    const spinStartTime = Date.now();
    this.startLotShuffle(spinStartTime);
    this.startSpinSound(spinStartTime);

    this.fetchWinnerFromServer()
      .then((chosenWinner) => {
        const winnerIndex = this.users.findIndex((user) => user.id === chosenWinner.id);
        if (winnerIndex < 0) {
          throw new Error('Winner is missing from wheel participants.');
        }

        const fullRotations = 6 * 360;
        const segment = 360 / this.users.length;
        const winnerCenterAngle = winnerIndex * segment + segment / 2;

        // Pointer is at top; the winner segment must land at 0° visual position.
        // desiredFinalAngle is the absolute wheel angle (mod 360) that places the
        // winner under the pointer.  We compute a delta from the current resting
        // position so the landing is correct on every spin, not just the first.
        const desiredFinalAngle = (360 - winnerCenterAngle % 360 + 360) % 360;
        const currentEffectiveAngle = this.wheelAngle % 360;
        let delta = desiredFinalAngle - currentEffectiveAngle;
        if (delta < 0) { delta += 360; }

        this.wheelAngle += fullRotations + delta;
        this.targetLotDigits = chosenWinner.id.replace(/\D/g, '').slice(-5).padStart(5, '0').split('');
        this.message = 'Rolling wheel and lot...';

        window.setTimeout(() => {
          this.isRolling = false;
          this.stopSpinSound();
          this.playSuccessChime();
          this.winner = chosenWinner;
          this.stopLotShuffle(chosenWinner.id);
          this.showWinnerPopup = true;
          this.message = `Winner: ${chosenWinner.name} (${chosenWinner.id})`;
        }, this.spinDurationMs);
      })
      .catch(() => {
        this.isRolling = false;
        this.stopSpinSound();
        this.stopLotShuffle('USM00000');
        this.message = 'Unable to fetch winner from server.';
      });
  }

  ngOnDestroy(): void {
    if (typeof document !== 'undefined' && this.previousBodyOverflowY !== null) {
      document.body.style.overflowY = this.previousBodyOverflowY;
      this.previousBodyOverflowY = null;
    }

    if (this.spinStartNoticeTimerId !== null) {
      window.clearTimeout(this.spinStartNoticeTimerId);
      this.spinStartNoticeTimerId = null;
    }

    if (this.entrySpinnerTimerId !== null) {
      window.clearTimeout(this.entrySpinnerTimerId);
      this.entrySpinnerTimerId = null;
    }

    if (this.entryCountdownTimerId !== null) {
      window.clearInterval(this.entryCountdownTimerId);
      this.entryCountdownTimerId = null;
    }

    if (this.accessBlockedTimerId !== null) {
      window.clearInterval(this.accessBlockedTimerId);
      this.accessBlockedTimerId = null;
    }

    this.stopSpinSound();
    if (this.audioContext !== null) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  closeWinnerPopup(): void {
    this.showWinnerPopup = false;
    this.layoutUi.setSidebarCollapsed(false);
    void this.exitFullscreen();
  }

  closeAccessBlockedPopup(): void {
    this.showAccessBlockedPopup = false;
    void this.router.navigate(['/dashboard']);
  }

  private async enterFullscreen(): Promise<void> {
    if (typeof document === 'undefined') {
      return;
    }

    if (document.fullscreenElement) {
      return;
    }

    const root = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
    };

    try {
      if (root.requestFullscreen) {
        await root.requestFullscreen();
      } else if (root.webkitRequestFullscreen) {
        await root.webkitRequestFullscreen();
      }
    } catch {
      // Fullscreen can fail due to browser policies; spin should continue anyway.
    }
  }

  private async exitFullscreen(): Promise<void> {
    if (typeof document === 'undefined') {
      return;
    }

    const doc = document as Document & {
      webkitExitFullscreen?: () => Promise<void>;
    };

    try {
      if (doc.fullscreenElement && doc.exitFullscreen) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      }
    } catch {
      // Ignore fullscreen exit failures.
    }
  }

  getLabelTransform(index: number): string {
    const angle = index * this.sliceAngle + this.sliceAngle / 2;
    const radius = 144;
    // Position at segment center and rotate tangentially for cleaner wheel-style alignment.
    return `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px) rotate(90deg)`;
  }

  get isCurrentUserWinner(): boolean {
    return !!this.winner && !!this.currentUserId && this.winner.id.trim().toUpperCase() === this.currentUserId;
  }

  get winnerPopupTitle(): string {
    return this.isCurrentUserWinner ? 'Jackpot Moment' : 'Congratulations';
  }

  get winnerPopupMessage(): string {
    return this.isCurrentUserWinner
      ? 'The wheel stopped on your name. This celebration is all yours.'
      : 'The wheel has chosen this round\'s lucky winner.';
  }

  get accessBlockedScheduledTimeText(): string {
    return this.getScheduleParts().time;
  }

  get accessBlockedScheduledDateText(): string {
    return this.getScheduleParts().date;
  }

  private getScheduleParts(): { date: string; time: string } {
    const segments = this.accessBlockedDateText.split(',').map((segment) => segment.trim()).filter(Boolean);

    if (segments.length >= 3) {
      return {
        date: `${segments[0]}, ${segments[1]}`,
        time: segments[2]
      };
    }

    return {
      date: this.accessBlockedDateText,
      time: this.accessBlockedDateText
    };
  }

  getRimBulbTransform(index: number): string {
    const angle = index * (360 / this.rimBulbCount);
    const radius = 228;
    return `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px)`;
  }

  private startLotShuffle(spinStartTime: number): void {
    if (this.lotIntervalId !== null) {
      window.clearInterval(this.lotIntervalId);
    }

    let iteration = 0;
    this.lotIntervalId = window.setInterval(() => {
      const elapsedTime = Date.now() - spinStartTime;

      // Progressive deceleration: noticeably slower in the final 5s.
      const isLastPhase = elapsedTime > this.spinSlowPhaseStartMs;
      const isFinalTwoSeconds = elapsedTime > this.spinDurationMs - 2000;
      const isFinalHalfSecond = elapsedTime > this.spinDurationMs - 500;

      const updateEvery = isLastPhase
        ? isFinalHalfSecond
          ? 24
          : isFinalTwoSeconds
            ? 14
            : 8
        : 2;

      if (iteration % updateEvery !== 0) {
        iteration++;
        return;
      }

      iteration++;

      // Create rotating digits with varying speeds for each position.
      // Base speed must NOT be an integer multiple of 10 — otherwise digit stays fixed at 0.
      const digits = Array.from({ length: 5 }, (_, index) => {
        // Cascade: leftmost digit spins fastest, rightmost slowest.
        const speed = 9.3 - index * 1.4;
        const rotationOffset = Math.floor((iteration * speed) % 10);
        return rotationOffset.toString();
      });

      // During the final phase, progressively lock digits to the winner ID
      // so the displayed lot converges smoothly before the spin stops.
      if (isLastPhase && this.targetLotDigits !== null) {
        const phaseDuration = this.spinDurationMs - this.spinSlowPhaseStartMs;
        const phaseElapsed = Math.max(0, elapsedTime - this.spinSlowPhaseStartMs);
        const phaseProgress = Math.min(phaseElapsed / phaseDuration, 1);
        const lockCount = Math.min(5, Math.floor(phaseProgress * 6));

        for (let i = 0; i < lockCount; i++) {
          const digitIndex = 4 - i; // lock from right to left
          digits[digitIndex] = this.targetLotDigits[digitIndex];
        }
      }

      this.lotSlots = ['U', 'S', 'M', ...digits];

      // Stop when spin duration completes
      if (elapsedTime > this.spinDurationMs && this.lotIntervalId !== null) {
        window.clearInterval(this.lotIntervalId);
        this.lotIntervalId = null;
      }
    }, 50);
  }

  private stopLotShuffle(userId: string): void {
    if (this.lotIntervalId !== null) {
      window.clearInterval(this.lotIntervalId);
      this.lotIntervalId = null;
    }

    const numericPart = userId.replace(/\D/g, '').slice(-5).padStart(5, '0');
    this.lotSlots = ['U', 'S', 'M', ...numericPart.split('')];
  }

  private fetchWinnerFromServer(): Promise<User> {
    // TODO: replace with real server call after API integration.
    const defaultWinner: User = { id: 'USM77335', name: 'KIRUBAKARAN R' };
    return new Promise((resolve, reject) => {
      const target = this.users.find((u) => u.id === defaultWinner.id) ?? defaultWinner;
      if (!this.users.length) {
        reject(new Error('No participants loaded.'));
        return;
      }
      resolve(target);
    });
  }

  private startSpinSound(spinStartTime: number): void {
    const context = this.getAudioContext();
    if (context === null) {
      return;
    }

    this.stopSpinSound();
    void context.resume();
    this.spinTickCount = 0;

    // Continuous low whirr layer that slowly drops with wheel speed.
    this.spinAmbientOscillator = context.createOscillator();
    this.spinAmbientGain = context.createGain();
    this.spinAmbientOscillator.type = 'sawtooth';
    this.spinAmbientOscillator.frequency.setValueAtTime(120, context.currentTime);
    this.spinAmbientGain.gain.setValueAtTime(0.0001, context.currentTime);
    this.spinAmbientGain.gain.exponentialRampToValueAtTime(0.02, context.currentTime + 0.08);
    this.spinAmbientOscillator.connect(this.spinAmbientGain);
    this.spinAmbientGain.connect(context.destination);
    this.spinAmbientOscillator.start(context.currentTime);

    const scheduleTick = () => {
      if (!this.isRolling) {
        return;
      }

      const elapsed = Date.now() - spinStartTime;
      const progress = Math.min(elapsed / this.spinDurationMs, 1);
      const speed = 1 - progress;

      if (this.spinAmbientOscillator !== null && this.spinAmbientGain !== null) {
        const now = context.currentTime;
        this.spinAmbientOscillator.frequency.setTargetAtTime(90 + speed * 90, now, 0.04);
        this.spinAmbientGain.gain.setTargetAtTime(0.004 + speed * 0.02, now, 0.05);
      }

      // Fast ticks at the beginning, then naturally slow down in the final phase.
      const nextTickDelay = 45 + progress * 235;
      this.playTick(context, speed);
      this.spinTickCount += 1;
      if (this.spinTickCount % 4 === 0) {
        this.playAccentTick(context, speed);
      }

      this.spinSoundTimerId = window.setTimeout(scheduleTick, nextTickDelay);
    };

    scheduleTick();
  }

  private stopSpinSound(): void {
    if (this.spinSoundTimerId !== null) {
      window.clearTimeout(this.spinSoundTimerId);
      this.spinSoundTimerId = null;
    }

    if (this.spinAmbientOscillator !== null && this.spinAmbientGain !== null && this.audioContext !== null) {
      const now = this.audioContext.currentTime;
      this.spinAmbientGain.gain.setTargetAtTime(0.0001, now, 0.06);
      this.spinAmbientOscillator.stop(now + 0.12);
    }

    this.spinAmbientOscillator = null;
    this.spinAmbientGain = null;
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') {
      return null;
    }

    if (this.audioContext === null) {
      const AudioContextCtor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) {
        return null;
      }
      this.audioContext = new AudioContextCtor();
    }

    return this.audioContext;
  }

  private playTick(context: AudioContext, speed: number): void {
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(260 + speed * 260, now);

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.03 + speed * 0.02, now + 0.008);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.08);
  }

  private playAccentTick(context: AudioContext, speed: number): void {
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(520 + speed * 180, now);

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.012 + speed * 0.015, now + 0.004);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.045);
  }

  private playSuccessChime(): void {
    const context = this.getAudioContext();
    if (context === null) {
      return;
    }

    void context.resume();
    const now = context.currentTime;

    // === Crowd cheer swell ===
    this.playCrowdCheer(context, now);

    // === Clapping bursts — 10 rapid claps spread over ~1.8s ===
    for (let i = 0; i < 10; i++) {
      this.playSingleClap(context, now + 0.15 + i * 0.18);
    }

    // === Triumphant fanfare — G4 → C5 → E5 → G5 → C6 ===
    const fanfare: { freq: number; t: number; dur: number; gain: number; type: OscillatorType }[] = [
      { freq: 392.00, t: 0.08, dur: 0.12, gain: 0.10, type: 'square'    }, // G4
      { freq: 523.25, t: 0.22, dur: 0.13, gain: 0.10, type: 'square'    }, // C5
      { freq: 659.25, t: 0.36, dur: 0.13, gain: 0.10, type: 'square'    }, // E5
      { freq: 783.99, t: 0.50, dur: 0.13, gain: 0.10, type: 'square'    }, // G5
      { freq: 1046.5, t: 0.65, dur: 0.55, gain: 0.12, type: 'triangle'  }, // C6 (hold)
    ];

    fanfare.forEach(({ freq, t, dur, gain, type }) => {
      this.playTone(context, freq, now + t, dur, gain, type);
      // Warm harmony a major third up
      this.playTone(context, freq * 1.25, now + t + 0.01, dur, gain * 0.35, 'sine');
    });

    // === Sparkle shimmer trail ===
    [1318.5, 1567.98, 2093.0, 2637.0].forEach((freq, i) => {
      this.playTone(context, freq, now + 0.85 + i * 0.09, 0.22, 0.022, 'sine');
    });
  }

  /** Synthesised crowd-cheer noise swell (band-pass filtered noise rising in frequency) */
  private playCrowdCheer(context: AudioContext, startTime: number): void {
    const duration = 2.0;
    const bufferSize = Math.ceil(context.sampleRate * duration);
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = context.createBufferSource();
    source.buffer = buffer;

    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(250, startTime);
    filter.frequency.linearRampToValueAtTime(900, startTime + 1.0);
    filter.Q.value = 0.7;

    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.18, startTime + 0.35);
    gain.gain.setValueAtTime(0.15, startTime + 1.0);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start(startTime);
    source.stop(startTime + duration);
  }

  /** Synthesised single hand-clap (high-passed short noise burst) */
  private playSingleClap(context: AudioContext, startTime: number): void {
    const bufferSize = Math.ceil(context.sampleRate * 0.11);
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = context.createBufferSource();
    source.buffer = buffer;

    const filter = context.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1400;

    const gain = context.createGain();
    gain.gain.setValueAtTime(0.22, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.11);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start(startTime);
    source.stop(startTime + 0.12);
  }

  private playTone(
    context: AudioContext,
    frequency: number,
    start: number,
    duration: number,
    peakGain: number,
    type: OscillatorType
  ): void {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);

    gainNode.gain.setValueAtTime(0.0001, start);
    gainNode.gain.exponentialRampToValueAtTime(peakGain, start + 0.018);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  private startEntrySequence(): void {
    this.showEntryOverlay = true;
    this.showEntrySpinner = true;
    this.entryCountdownValue = 3;

    if (this.entrySpinnerTimerId !== null) {
      window.clearTimeout(this.entrySpinnerTimerId);
      this.entrySpinnerTimerId = null;
    }

    if (this.entryCountdownTimerId !== null) {
      window.clearInterval(this.entryCountdownTimerId);
      this.entryCountdownTimerId = null;
    }

    this.entrySpinnerTimerId = window.setTimeout(() => {
      this.showEntrySpinner = false;
      this.startEntryCountdown();
      this.entrySpinnerTimerId = null;
    }, this.entrySpinnerDurationMs);
  }

  private startEntryCountdown(): void {
    if (this.entryCountdownTimerId !== null) {
      window.clearInterval(this.entryCountdownTimerId);
      this.entryCountdownTimerId = null;
    }

    this.entryCountdownTimerId = window.setInterval(() => {
      if (this.entryCountdownValue > 1) {
        this.entryCountdownValue -= 1;
        return;
      }

      this.showEntryOverlay = false;
      if (this.entryCountdownTimerId !== null) {
        window.clearInterval(this.entryCountdownTimerId);
        this.entryCountdownTimerId = null;
      }

      if (this.autoStartSpinAfterEntryCountdown) {
        this.autoStartSpinAfterEntryCountdown = false;
        this.roll();
      }
    }, this.entryCountdownStepMs);
  }
}
