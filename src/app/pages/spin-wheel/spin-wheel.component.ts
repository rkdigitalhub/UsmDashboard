import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';

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
  imports: [NgIf, NgFor],
  templateUrl: './spin-wheel.component.html',
  styleUrls: ['./spin-wheel.component.scss']
})
export class SpinWheelComponent {
  readonly users: User[] = [
    { id: 'USM10421', name: 'Aarav' },
    { id: 'USM10277', name: 'Neha' },
    { id: 'USM10038', name: 'Rohan' },
    { id: 'USM10915', name: 'Ishita' },
    { id: 'USM10766', name: 'Kabir' },
    { id: 'USM10309', name: 'Ananya' },
    { id: 'USM10654', name: 'Vihaan' },
    { id: 'USM10188', name: 'Sara' },
    { id: 'USM10091', name: 'Aditi' },
    { id: 'USM10214', name: 'Rahul' },
    { id: 'USM10372', name: 'Pooja' },
    { id: 'USM10463', name: 'Karan' },
    { id: 'USM10527', name: 'Meera' },
    { id: 'USM10611', name: 'Arjun' },
    { id: 'USM10702', name: 'Nisha' },
    { id: 'USM10834', name: 'Dev' },
    { id: 'USM10948', name: 'Priya' },
    { id: 'USM11005', name: 'Harsh' },
    { id: 'USM11062', name: 'Riya' },
    { id: 'USM11119', name: 'Manav' }
  ];

  // Temporary fallback until server integration is wired.
  private readonly defaultServerWinner: User = { id: 'USM10654', name: 'Vihaan Das' };

  winner: User | null = null;
  message = '';

  wheelAngle = 0;
  isRolling = false;
  showWinnerPopup = false;

  lotSlots: string[] = ['U', 'S', 'M', '0', '0', '0', '0', '0'];
  private lotIntervalId: number | null = null;
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

  get canRoll(): boolean {
    return !this.isRolling;
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

  roll(): void {
    if (!this.canRoll) {
      this.message = 'Roll is already in progress.';
      return;
    }

    this.showWinnerPopup = false;
    this.isRolling = true;
    this.winner = null;
    this.message = 'Fetching winner from server...';
    const spinStartTime = Date.now();
    this.startLotShuffle(spinStartTime);

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
        this.message = 'Rolling wheel and lot...';

        window.setTimeout(() => {
          this.isRolling = false;
          this.winner = chosenWinner;
          this.stopLotShuffle(chosenWinner.id);
          this.showWinnerPopup = true;
          this.message = `Winner: ${chosenWinner.name} (${chosenWinner.id})`;
        }, 5000);
      })
      .catch(() => {
        this.isRolling = false;
        this.stopLotShuffle('USM00000');
        this.message = 'Unable to fetch winner from server.';
      });
  }

  closeWinnerPopup(): void {
    this.showWinnerPopup = false;
  }

  getLabelTransform(index: number): string {
    const angle = index * this.sliceAngle + this.sliceAngle / 2;
    const radius = 144;
    // Position at segment center and rotate tangentially for cleaner wheel-style alignment.
    return `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px) rotate(90deg)`;
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

      // In the last 1 second, only update every 6 iterations (slower effect)
      const isLastPhase = elapsedTime > 4000;
      if (isLastPhase && iteration % 6 !== 0) {
        iteration++;
        return;
      }

      iteration++;
      
      // Create rotating digits with varying speeds for each position
      const digits = Array.from({ length: 5 }, (_, index) => {
        // Different rotation speeds: faster on left, slower on right (cascading effect)
        const speed = 10 - index * 1.5;
        const rotationOffset = Math.floor((iteration * speed) % 10);
        return rotationOffset.toString();
      });
      
      this.lotSlots = ['U', 'S', 'M', ...digits];

      // Stop after 5 seconds
      if (elapsedTime > 5000 && this.lotIntervalId !== null) {
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
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(this.defaultServerWinner);
      }, 650);
    });
  }
}
