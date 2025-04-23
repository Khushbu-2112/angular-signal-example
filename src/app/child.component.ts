import { ChangeDetectionStrategy, Component, computed, Input, Signal } from "@angular/core";

@Component({
    selector: 'app-child',
    standalone: true,
    template: `
      <p> Full Name: {{ fullName() }} </p>
      <button (click)="clickCalled()" >Just Click</button>
      <p>Count: {{count()}} => x2 = {{doubleCount()}}</p>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  export class ChildComponent {
    // @Input() user!: { firstName: string; lastName: string };
  
    // get fullName() {
    //     console.log('Getter re-evaluated');
    //   return `${this.user?.firstName} ${this.user?.lastName}`;
    // }

    ngDoCheck() {
      // console.log('Change detection triggered in ChildComponent');
    }

    clickCalled(){
      console.warn('button clicked');
    }

    //*********** Signals *************

    @Input() user!: Signal<{ firstName: string; lastName: string }>;

    fullName = computed(() => {
      // console.log('Computed fullName updated');
      return `${this.user().firstName} ${this.user().lastName}`});

    @Input() count!: Signal<number>;
    doubleCount = computed(() => {
      // console.log('count * 2');
      return this.count()*2;
    });
  }