import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-widget5',
  templateUrl: './stats-widget5.component.html',
})
export class StatsWidget5Component {
  @Input() imgIcon = '';
  @Input() iconColor = '';
  @Input() color = '';
  @Input() description = '';
  @Input() title = '';

  constructor() {}
}
