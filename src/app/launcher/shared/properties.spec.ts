import { PropertiesGetter } from './properties';

describe('should fatten object and fill properties', () => {
  let propertiesGetter;
  it('should work for empty', () => {
    this.propertiesGetter = new PropertiesGetter({});

    expect(this.propertiesGetter.mapKeys({ not: 'not' })).toEqual({ not: undefined });
  });

  it('should work for normal properties', () => {
    this.propertiesGetter = new PropertiesGetter({ superman: 'clark kent', batman: 'bruce wayne' });

    expect(this.propertiesGetter.mapKeys({ 'who is batman': 'batman' })).toEqual({ 'who is batman': 'bruce wayne' });
  });

  it('should work for nested properties', () => {
    this.propertiesGetter = new PropertiesGetter({ super: { man: 'clark' } });

    expect(this.propertiesGetter.mapKeys({ 'super': { 'firstname': 'man' } }))
      .toEqual({ 'super': { 'firstname': 'clark' } });
  });

  it('should work for nested properties not found', () => {
    this.propertiesGetter = new PropertiesGetter({ super: { man: 'clark' } });

    expect(this.propertiesGetter.mapKeys({ 'super': { 'lives': 'not' } })).toEqual({ 'super': { 'lives': undefined } });
  });

  it('should work for nested complex', () => {
    this.propertiesGetter = new PropertiesGetter({
      avengers: {
        hawk: { eye: 'clint barton' },
        super: { man: 'clark' },
        bat: { man: 'bruce wayne' }
      }
    });

    expect(this.propertiesGetter.mapKeys({ 'avengers.hawk': { 'never misses': 'eye' } }))
      .toEqual({ 'avengers.hawk': { 'never misses': 'clint barton' } });
  });

});
