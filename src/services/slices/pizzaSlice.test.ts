import reducer, {
  selectDough,
  selectSize,
  setToppings,
  toggleTopping,
} from './pizzaSlice';

describe('pizza configuration', () => {
  it('starts with a balanced Margherita selection', () => {
    const state = reducer(undefined, { type: 'init' });

    expect(state).toEqual({
      doughId: 'dough-classic',
      size: 'medium',
      toppingIds: ['cheese-mozzarella', 'veg-tomato', 'veg-basil'],
    });
  });

  it('updates dough, size, and removable toppings', () => {
    const state = [
      selectDough('dough-glutenfree'),
      selectSize('large'),
      toggleTopping('veg-olive'),
      toggleTopping('veg-tomato'),
    ].reduce(reducer, undefined);

    expect(state.doughId).toBe('dough-glutenfree');
    expect(state.size).toBe('large');
    expect(state.toppingIds).toEqual(['cheese-mozzarella', 'veg-basil', 'veg-olive']);
  });

  it('replaces the toppings when choosing a menu pizza', () => {
    const state = reducer(undefined, setToppings(['mushroom-porcini']));

    expect(state.toppingIds).toEqual(['mushroom-porcini']);
  });
});
