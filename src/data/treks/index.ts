import { everestBaseCamp }         from './everest-base-camp';
import { annapurnaCircuit }         from './annapurna-circuit';
import { annapurnaBaseCamp }        from './annapurna-base-camp';
import { langtangValley }           from './langtang-valley';
import { manasluCircuit }           from './manaslu-circuit';
import { upperMustang }             from './upper-mustang';
import { mardiHimal }               from './mardi-himal';
import { northAnnapurnaBaseCamp }   from './north-annapurna-base-camp';
import { panchPokhari }             from './panchpokhari';
import type { Trek } from '../../types';

export const TREKS: Trek[] = [
  everestBaseCamp,
  annapurnaCircuit,
  annapurnaBaseCamp,
  mardiHimal,
  northAnnapurnaBaseCamp,
  langtangValley,
  manasluCircuit,
  upperMustang,
  panchPokhari,
];

export const getTrekById = (id: string): Trek | undefined =>
  TREKS.find((t) => t.id === id);

export const getTrekBySlug = (slug: string): Trek | undefined =>
  TREKS.find((t) => t.slug === slug);

export {
  everestBaseCamp,
  annapurnaCircuit,
  annapurnaBaseCamp,
  langtangValley,
  manasluCircuit,
  upperMustang,
  mardiHimal,
  northAnnapurnaBaseCamp,
  panchPokhari,
};
