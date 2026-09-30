// Removes a leading "# Heading": the page layout already renders the title
// (taken from frontmatter, or from that heading — see src/lib/content.ts).
// Lets files keep their H1 so they read well on GitHub too.
export default function remarkStripTitle() {
  return (tree) => {
    const i = tree.children.findIndex((n) => n.type !== 'yaml' && n.type !== 'toml' && !n.type.startsWith('mdxjsEsm'));
    if (tree.children[i]?.type === 'heading' && tree.children[i].depth === 1) tree.children.splice(i, 1);
  };
}
