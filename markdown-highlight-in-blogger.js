//
// markdown-highlight-in-blogger.js -- javascript for using Markdown in Blogger
// Based on:
// - Francis Tang's 2011: http://blog.chukhang.com/2011/09/markdown-in-blogger.html
// - Divya van Mahajan's 2017:
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

    console.info('Converting markdown using jQuery');


    $('div.post-body').each(function (i, block) {
      console.info(`Found post body block ${block.id}`);
      var convertBody = true;
      $('span.post-labels a').each(function (i, tagLink) {
        console.info(`Found label ${tagLink.innerText}`);
        if (tagLink.innerText === "no-markdown") {
          console.warn("Not performing Markdown conversion on blog post body");
          tagLink.hidden = true;
          convertBody = false;
        }
      });

      if (convertBody) {
        MarkdownHighlightInBlogger.convertBlock(block, "post-body");
      }
    });

    $('pre.markdown').each(function (i, block) {
      console.info(`Converting block ${block.id}`);
      MarkdownHighlightInBlogger.convertBlock(block);
    });
    $('pre code').each(function (i, block) {
      hljs.highlightBlock(block);
    });
  } catch (exc) {
    console.error(exc);
  }
};

$(document).ready(MarkdownHighlightInBlogger.convertMD);

