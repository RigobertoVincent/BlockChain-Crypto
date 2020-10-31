/* 
*** Loads all templates into index.html which will then be shown using javascript
*/
const links = document.querySelectorAll('link[rel="import"]')

// import and add each page to the DOM
Array.prototype.forEach.call(links, (link) => {
    let template = link.import.querySelector('.task-template');
    let clone = document.importNode(template.content, true);
    document.querySelector('.content').appendChild(clone);
})