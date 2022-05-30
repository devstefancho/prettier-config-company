function hasExcludeLabel(labels, customForFitpet) {
  return labels.find(({ name }) => {
    const _hasExcludeLabel =
      /exclude/.test(name) && new RegExp(customForFitpet.base).test(name);
    console.log(
      `${
        _hasExcludeLabel &&
        `Exluding PR to ${customForFitpet.base} by ${name} label`
      }`
    );
    return _hasExcludeLabel;
  })
}

function alphaOnly(labels) {
  return labels.find(label => /alpha-only/.test(label.name))
}

async function createPullRequest({ context, github }, customForFitpet) {
  const { repo, owner } = context.repo;
  const { title, body, head } = context.payload.pull_request;
  const result = await github.rest.pulls.create({
    title,
    owner,
    repo,
    head: head.ref,
    base: customForFitpet.base,
    body,
  });
  await github.rest.issues.addLabels({
    owner,
    repo,
    issue_number: result.data.number,
    labels: [customForFitpet.base, 'pending'],
  });
}

module.exports = async ({ context, github }, customForFitpet) => {
  const { labels } = context.payload.pull_request;
  console.log('===== Print Labels =====');
  console.log(labels);

  if (alphaOnly(labels)) return console.log('Alpha-Only label exist');
  if (hasExcludeLabel(labels, customForFitpet)) return;
  await createPullRequest({ context, github }, customForFitpet)
};
