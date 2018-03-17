import lolex from 'lolex';

window.clock = lolex.install({
  now: new Date(),
  shouldAdvanceTime: true,
});
