module.exports = async ({ context, github }, customForFitpet) => {
  const { repo, owner } = context.repo;
  const { title, body, head, labels } = context.payload.pull_request;
  console.log(labels);

  if (
    labels.find(({ name }) => {
      const hasExcludeLabel =
        /exclude/.test(name) && new RegExp(customForFitpet.base).test(name);
      console.log(
        `${
          hasExcludeLabel &&
          `Exluding PR to ${customForFitpet.base} by ${name} label`
        }`
      );
      return hasExcludeLabel;
    })
  ) {
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
