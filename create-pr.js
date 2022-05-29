module.exports = async ({ context, github }, customForFitpet) => {
  const { repo, owner } = context.repo;
  const { title, body, head } = context.payload.pull_request;
  console.log('bbbaseeee')
  console.dir(base);
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
    labels: [base, 'pending'],
  });
};
