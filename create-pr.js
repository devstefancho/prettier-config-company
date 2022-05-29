module.exports = async ({ context, github }, customForFitpet) => {
  const { repo, owner } = context.repo;
  const { title, body, head, labels } = context.payload.pull_request;
  console.log(labels);
  if (labels.find(label => /only/.test(label))) {
    console.log('Only label exist')
    return;
  }
  const result = await github.rest.pulls.create({
    title,
    owner,
    repo,
    head: head.ref,
    base: customForFitpet.base,
    body,
  });
  github.rest.issues.addLabels({
    owner,
    repo,
    issue_number: result.data.number,
    labels: [customForFitpet.base, 'pending'],
  });
};
