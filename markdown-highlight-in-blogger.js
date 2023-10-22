//
// markdown-highlight-in-blogger.js -- javascript for using Markdown in Blogger
// Based on:
// - Francis Tang's 2011: http://blog.chukhang.com/2011/09/markdown-in-blogger.html
// - Divya van Mahajan's 2017: https://js-react.blogspot.com/2017/01/using-markdown-in-blogger.html
//
// Redistributable under a BSD-style open source license.
// Documentation: https://github.com/themillhousegroup/md-in-blogger
//

// namespace
var MarkdownHighlightInBlogger = {};

MarkdownHighlightInBlogger.convertBlock = function (block, classToAdd) {
    // showdown renderer
    var converter = new showdown.Converter({});
    converter.setFlavor('github');
    var rawText = block.innerHTML;
    console.info(`Converting '${rawText}'...`);
    var html = converter.makeHtml(rawText);
    console.info(`Converted to '${html}'`);
    var md = $(html); //.css('border','3px solid blue');
    md.insertBefore(block);
    classToAdd && md.addClass(classToAdd);
    block.hidden = true;
};

MarkdownHighlightInBlogger.convertMD = function () {
  try {
    // Wait until everything has been processed before
    // attempting Mermaid diagram conversion;
    // https://mermaid.js.org/config/usage.html
    mermaid.initialize({ startOnLoad: false });

    $('div.post.hentry').each(function (i, block) {
      var convertBody = false;
      $(block).find('span.post-labels a').each(function (i, tagLink) {
        if (tagLink.innerText === "markdown-enabled") {
          console.info(`Found label '${tagLink.innerText}' - will perform Markdown conversion on blog post entry ${block.id}`);
          tagLink.hidden = true;
          convertBody = true;
        }
      });

      if (convertBody) {
        var body = $(block).find("div.post-body.entry-content")[0];
        MarkdownHighlightInBlogger.convertBlock(body, "post-body entry-content markdown-enhanced");
      }
    });

    $('pre.markdown').each(function (i, block) {
      console.info(`Converting block ${block.id}`);
      MarkdownHighlightInBlogger.convertBlock(block);
    });
    $('pre code:not(.mermaid)').each(function (i, block) {
      console.info(`Found code block - applying highlighting`)
      hljs.highlightBlock(block);
    });

    $('pre code.mermaid').each(function (i, mermaidBlock) {
      // console.info(`Found mermaid block - applying pre-Mermaid unescapes`);
      const oldContent = mermaidBlock.innerHTML;
      // console.info(`oldContent: ${oldContent}`);
      var doc = new DOMParser().parseFromString(oldContent, "text/html");
      // console.info(`newContent: ${doc.documentElement.textContent}`);

      mermaidBlock.innerHTML = doc.documentElement.textContent;
    });

    mermaid.run({
      querySelector: 'pre code.mermaid',
      suppressErrors: false,
    });
  } catch (exc) {
    console.error(exc);
  }
};

$(document).ready(MarkdownHighlightInBlogger.convertMD);

