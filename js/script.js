'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTag: Handlebars.compile(document.querySelector('#template-article-tag').innerHTML),
  articleAuthor: Handlebars.compile(document.querySelector('#template-article-author').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML),
}

function titleClickHandler(event){
    event.preventDefault();
    const clickedElement = this;
  console.log('Link was clicked!');
  console.log(event);
  console.log(clickedElement);

  

  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

for(let activeLink of activeLinks){
  activeLink.classList.remove('active');
}

  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.post.active');
  for(let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
 console.log(articleSelector);

  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  console.log(targetArticle);

  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}


const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.list.authors';


function generateTitleLinks(customSelector = ''){
    console.log(customSelector);

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  function clearMessages() {
    titleList.innerHTML = ''; 
  }
  clearMessages();

  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  console.log(articles);
  let html = '';
  for(let article of articles) {
    console.log(article)

    /* get the article id */
const articleId = article.getAttribute('id');
console.log(articleId);

    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* get the title from the title element */

    /* create HTML of the link */
    // const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    /* insert link into titleList */
    html = html + linkHTML;
    console.log(html);
    titleList.innerHTML = html;
  }
  const links = document.querySelectorAll('.titles a');

 for(let link of links){
  link.addEventListener('click', titleClickHandler);
  console.log(link);
}

}

generateTitleLinks();


function calculateTagsParams(allTags) {
    const params = {
        max: '0',
        min: '999999'
    } 
    for(let tag in allTags){
        console.log(tag + ' is used ' + allTags[tag] + ' times');
        if(allTags[tag] > params.max) {
            params.max = allTags[tag];
        } else if(allTags[tag] < params.min) {
            params.min = allTags[tag];
        }
      }
    return params;
}


function calculateTagsClass(count, params) {
   
    const normalizedCount = count - params.min;
    const normalizedMax = params.max -params.min;
    const percentage = normalizedCount/normalizedMax;
    const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );

    return optCloudClassPrefix + classNumber;
}




function generateTags(){
    /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);
    for(let article of articles) {
  
    /* START LOOP: for every article: */
  
      /* find tags wrapper */
      const tagWrapper = article.querySelector(optArticleTagsSelector);
  
      /* make html variable with empty string */
      let html = '';
  
      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');
      console.log(articleTags);
  
      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      console.log(articleTagsArray);
  
      /* START LOOP: for each tag */
      for(let tag of articleTagsArray){
        console.log(tag);
        /* generate HTML of the link */
        // const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
        const linkHTMLData = {tag: tag};
        const linkHTML = templates.articleTag(linkHTMLData);
        /* add generated code to html variable */
        html = html + linkHTML;
        console.log(html);
   /* [NEW] check if this link is NOT already in allTags */
   if(!allTags.hasOwnProperty(tag)){
    /* [NEW] add generated code to allTags array */
    allTags[tag] = 1;
  } else {
    allTags[tag]++;
  }

      /* END LOOP: for each tag */
      }
      /* insert HTML of all the links into the tags wrapper */
      tagWrapper.innerHTML = html;
  
    /* END LOOP: for every article: */
    }
    /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);

  /* [NEW] add html from allTags to tagList */
//   tagList.innerHTML = allTags.join(' ');
  console.log(allTags);

//Create variable for all links HTML code
const tagsParams = calculateTagsParams(allTags);
console.log('tagsParams:', tagsParams);

  // let allTagsHTML = '';
  const allTagsData = {tags: []};
  //Start loop: for eacg tag in allTags
  for(let tag in allTags) {
//generate code of a link and add it to allTagsHTML
// const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
// allTagsHTML += '<li><a class="'+calculateTagsClass(allTags[tag], tagsParams)+'" href="#tag-' + tag +'">' + tag + ' (' + allTags[tag] + ')</li> ';
allTagsData.tags.push({
  tag: tag,
  count: allTags[tag],
  className: calculateTagsClass(allTags[tag], tagsParams)
})
  }
// tagList.innerHTML = allTagsHTML;
tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log(allTagsData);
  }
  
  generateTags();

  function tagClickHandler(event){
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
  
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', ' ');
    console.log(tag);
    /* find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
  console.log(activeTags);
    /* START LOOP: for each active tag link */
    for(let activeTag of activeTags) {
  
      /* remove class active */
  activeTag.classList.remove('active');
    /* END LOOP: for each active tag link */
  }
    /* find all tag links with "href" attribute equal to the "href" constant */
  const tagsLinks = document.querySelectorAll('[href="' + href + '"]');
    /* START LOOP: for each found tag link */
  for(let tagLink of tagsLinks) {
    console.log(tagLink);
      /* add class active */
  tagLink.classList.add('active');
    /* END LOOP: for each found tag link */
}
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }
  
  function addClickListenersToTags(){
    /* find all links to tags */
   const allLinks = document.querySelectorAll('.list-horizontal a');
    /* START LOOP: for each link */
   for( let allLink of allLinks) {
      /* add tagClickHandler as event listener for that link */
 allLink.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
  }
  }
  
  addClickListenersToTags();


  function calculateAuthorTagsParams(allAuthorTags) {
    const params = {
        max: '0',
        min: '999999'
    } 
    for(let authorTags in allAuthorTags){
        console.log(authorTags + ' is used ' + allAuthorTags[authorTags] + ' times');
        if(allAuthorTags[authorTags] > params.max) {
            params.max = allAuthorTags[authorTags];
        } else if(allAuthorTags[authorTags] < params.min) {
            params.min = allAuthorTags[authorTags];
        }
      }
    return params;
}


  function generateAuthors() {
    let allAuthorTags = {};
    const articles = document.querySelectorAll(optArticleSelector);
    for(let article of articles) {
        const authorWrapper = article.querySelector(optArticleAuthorSelector);
        console.log(authorWrapper);
        let html = '';
        const authorTags = article.getAttribute('data-author');
        console.log(authorTags);
        // const linkHtml = '<a href="#author-' + authorTags + '">' + authorTags + '</a>';
        const linkHTMLData = {author: authorTags};
        const linkHtml = templates.articleAuthor(linkHTMLData);
        // const linkHtml = `<a href="#author-${authorTags}">${authorTags}</a>`
        console.log(linkHtml);
        html = html + linkHtml;
    if(!allAuthorTags.hasOwnProperty(authorTags)) {
        allAuthorTags[authorTags] = 1;
    } else {
        allAuthorTags[authorTags]++;
    }   
        authorWrapper.innerHTML = html;
  }
  const authorList = document.querySelector( optAuthorsListSelector);
  console.log(allAuthorTags);

  const tagsAuthorParams = calculateAuthorTagsParams(allAuthorTags);
  console.log('tagsParams:', tagsAuthorParams);

  // let allAuthorTagsHTML = '';
  const allAuthorsData = {authors: []};
  for (let authorTags in allAuthorTags) {
  
    allAuthorsData.authors.push({
      author: authorTags,
      count: allAuthorTags[authorTags]
    })
}

  //  authorList.innerHTML = allAuthorTagsHTML;
   authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
}
generateAuthors();

 function authorClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;
    console.log(clickedElement);
    const href = clickedElement.getAttribute('href');
    const tag = href.replace('#author-', '');
    console.log(tag);
    const activeTags = document.querySelectorAll('a.active[href^="#author-"]');
    for(let activeTag of activeTags) {
  
        /* remove class active */
    activeTag.classList.remove('active');
      /* END LOOP: for each active tag link */fhdf
    }
      /* find all tag links with "href" attribute equal to the "href" constant */
    const tagsLinks = document.querySelectorAll('[href="' + href + '"]');
      /* START LOOP: for each found tag link */
    for(let tagLink of tagsLinks) {
      console.log(tagLink);
        /* add class active */
    tagLink.classList.add('active');
      /* END LOOP: for each found tag link */
  }
  generateTitleLinks('[data-author="' + tag + '"]');
 }

//  authorClickHandler();

  function addClickListenersToAuthor() {
    const links = document.querySelectorAll('.post-author a');
    for(let link of links) {
        link.addEventListener('click', authorClickHandler);
        console.log(link);
    }
 }
 addClickListenersToAuthor();



