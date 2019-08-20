export default ({ store }, inject): void => {
  inject('signage', store.state.signage)
  inject('controller', store.state.controller)
}
