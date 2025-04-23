import { Component, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ChildComponent } from './child.component';
import { SignalDebuggerService } from 'signals-debugger';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ChildComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'angular-signals';
  
  quantity = signal<number>(1);
  qtyAvailable = signal<Array<number>>([1, 2, 3, 4, 5, 6]);

  selectedDish = signal<Dish>({
    id: 1,
    name: 'Manchurian',
    price: 50,
  });

  constructor(private signalDebugger: SignalDebuggerService) {
    this.signalDebugger.traceSignal(this.quantity, 'quntity');
    this.signalDebugger.traceSignal(this.selectedDish, 'selected dish');
    this.signalDebugger.traceSignal(this.totalPrice, 'totalPrice');

    this.signalDebugger.trackDependency('totalPrice', 'selected dish');

    this.signalDebugger.viewDependencyGraph();
    this.signalDebugger.viewSignalValue('selected dish');
     // effect(() => console.log(this.selectedDish()));
  }

  onQuantitySelected(qty: number) {
    this.quantity.set(qty);
  }

  updatePrice(){
    this.selectedDish.update(dish => ({
      ...dish,
      price: dish.price * 2
    }));
  }

  totalPrice = computed(() => {
    /*  The computed signal value is memoized, meaning it stores the computed result. 
        That computed value is reused the next time the computed value is read.
    */
    // console.log('Computing total price...'); 
    this.signalDebugger.trackDependency('totalPrice', 'selected dish');

    this.signalDebugger.viewDependencyGraph();
    this.signalDebugger.viewSignalValue('selected dish');
    return this.selectedDish().price * this.quantity()
  });

  color = computed(() => this.totalPrice() > 500 ? 'green' : 'blue');


  // Signal equality check (===)
  /*
  a signal will only emit a new value if the new value that we are trying to emit is different then the previous value.
  If the value that we are trying to emit is considered to be the same as the previous value, 
  then Angular will not emit the new signal value.
  */
  count = signal<number>(1);
  incCount(){
    this.count.update(c => c+1);
  }

  //******** change detection example ***********

  // user = { firstName: 'Khushbu', lastName: 'Raval' };

  // updateUser() {
  //   this.user = { firstName: 'Krina', lastName: 'Patel' }; // New reference triggers change detection
  // }

  //*********** Signals *************

  user = signal({ firstName: 'Khushbu', lastName: 'Raval' });

  updateUser() {
    this.user.set({
      firstName: 'Krina', lastName: 'Patel'
    });
  }
  
}

interface Dish {
  id: number;
  name: string;
  price: number;
}
