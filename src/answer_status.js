export default function render({ data, parentElement }) {
  const doc = parentElement.ownerDocument;
  const answer = doc.querySelector(`.st-key-${data.answerKey} textarea`);
  // Own the status node: changing React's native caption children corrupts rerenders.
  const feedback = parentElement.querySelector('.answer-save-feedback');
  if (!answer || !feedback) return;
  feedback.setAttribute('role', 'status');
  feedback.setAttribute('aria-live', 'polite');
  const dirty = () => answer.value !== data.savedAnswer;
  const update = () => {
    feedback.textContent = dirty()
      ? (data.error ? 'Save failed · Your answer remains in this session. Retry saving or copy it before leaving.'
        : 'Unsaved changes · Leave the answer field to save.')
      : data.message;
  };
  const blur = () => {
    if (dirty()) feedback.textContent = 'Saving…';
  };
  const apply = (event) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) blur();
  };
  answer.addEventListener('input', update);
  answer.addEventListener('blur', blur);
  answer.addEventListener('keydown', apply);
  update();
  // Native widgets can finish restoring their value after this component mounts.
  let frame = requestAnimationFrame(() => {
    frame = requestAnimationFrame(update);
  });
  return () => {
    cancelAnimationFrame(frame);
    answer.removeEventListener('input', update);
    answer.removeEventListener('blur', blur);
    answer.removeEventListener('keydown', apply);
  };
}
