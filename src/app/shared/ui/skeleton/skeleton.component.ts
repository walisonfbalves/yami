import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'yami-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.css']
})
export class SkeletonComponent {
  @Input() width: string = '100%';
  @Input() height: string = '20px';
  @Input() className: string = '';
}
