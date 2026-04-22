export const SERVICES = [
  { id: 'classic-set',  name: 'Classic Set',       price: 5000, duration: 90,  category: 'Lashes & Fill' },
  { id: 'classic-fill', name: 'Classic Fill',      price: 3000, duration: 60,  category: 'Lashes & Fill' },
  { id: 'hybrid-set',   name: 'Hybrid Set',        price: 5500, duration: 105, category: 'Lashes & Fill' },
  { id: 'hybrid-fill',  name: 'Hybrid Fill',       price: 3500, duration: 75,  category: 'Lashes & Fill' },
  { id: 'volume-set',   name: 'Volume Set',        price: 6000, duration: 120, category: 'Lashes & Fill' },
  { id: 'volume-fill',  name: 'Volume Fill',       price: 4500, duration: 90,  category: 'Lashes & Fill' },
  { id: 'stargazer',    name: 'Stargazer Lashes',  price: 5500, duration: 90,  category: 'Lashes & Fill' },
  { id: 'lash-lift',    name: 'Lash Lift',         price: 5000, duration: 60,  category: 'Lashes & Fill' },
  { id: 'lamination',   name: 'Brow Lamination',   price: 7000, duration: 60,  category: 'Eyebrows' },
  { id: 'henna-tint',   name: 'Henna Brow Tint',   price: 4000, duration: 45,  category: 'Eyebrows' },
  { id: 'removal',      name: 'Lash Removal',      price: 2000, duration: 30,  category: 'Extras' },
]

export function getService(id) {
  return SERVICES.find(s => s.id === id)
}

export function formatPrice(cents) {
  return `$${(cents / 100).toFixed(0)}`
}
