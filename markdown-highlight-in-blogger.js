//
// markdown-highlight-in-blogger.js -- javascript for using Markdown in Blogger
// Based on Francis Tang's http://blog.chukhang.com/2011/09/markdown-in-blogger.html
// Copyright (c) 2017 Divya van Mahajan
//
// Redistributable under a BSD-style open source license.
// Documentation: https://github.com/cs905s/md-in-blogger
//

// namespace
var MarkdownHighlightInBlogger = {};
// From http://erlend.oftedal.no/blog/?blogid=14
MarkdownHighlightInBlogger.unescapeHTML = function (html) {
  var htmlNode = document.createElement("DIV");
  htmlNode.innerHTML = html;
  if(htmlNode.innerText !== undefined)
    return htmlNode.innerText; // IE
  return htmlNode.textContent; // FF
};

MarkdownHighlightInBlogger.convertBlock = function (block, classToAdd) {
      //var rawtext = MarkdownHighlightInBlogger.unescapeHTML(block.innerText);
      var rawText = block.innerText;
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

    // showdown renderer
    var converter = new showdown.Converter({});
    converter.setFlavor('github');

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

