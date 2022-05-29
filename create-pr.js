module.export = async ({ context, github }, base) => {
  const { repo, owner } = context.repo;
  const { title, body, head } = context.payload.pull_request;
  const result = await github.rest.pulls.create({
    title,
    owner,
    repo,
    head: head.ref,
    base,
    body,
  });
  github.rest.issues.addLabels({
    owner,
    repo,
    issue_number: result.data.number,
    labels: [base, 'pending'],
  });
};
