/*
***
*** This file handles the content being rendered on index.html
***
*/

document.body.addEventListener('click', (event) => {
    if (event.target.dataset.section) {
        handleSectionTrigger(event);
    } 
});

function handleSectionTrigger(event) {
    // hide everything else that is not this event
    hideAllSectionsAndDeselectButtons();


    // highlight the current button being pressed
    //event.target.classList.add('is-selected');
    

    // display the current section
    const sectionId = `${event.target.dataset.section}-section`;
    document.getElementById(sectionId).classList.add('is-shown');


    // save current active button in localStorage

}

function hideAllSectionsAndDeselectButtons() {
    const sections = document.querySelectorAll('.section.is-shown');
    Array.prototype.forEach.call(sections, (section) => {
        section.classList.remove('is-shown');
    })
}