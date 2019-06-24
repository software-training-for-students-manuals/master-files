// wait for document to fully load
$(document).ready(function () {
    hljs.initHighlightingOnLoad();


    /*
     BEGIN ABOUT PAGE BUILDER
     The code below inserts the HTML containing the "About Software Training for Students" section of the manual.
     If you would like to change any details about this about page, you can edit the page here.
     */

    var aboutText = $("#about-page").load(window.location.protocol+"//"+window.location.hostname+"/manuals/master-files/about.html");


    /*
    END ABOUT PAGE BUILDER
    */

    /* 
    Create function to collapse/expand Topic sections
    */

    var toggleCollapseSection = function(el) { 
        this.parentNode.classList.toggle('collapsed');
    }

    var toggleCollapseOutlineTopic = function(el) { 
        this.classList.toggle('topic-collapsed');
    }

    var togglePrimaryTopicsOnly = function(el) {
        var toggleButton = document.getElementById("toggle-subtopics");
        document.querySelector(".primary-topics").classList.toggle('primary-topics-only');
        toggleButton.showSubtopics = !toggleButton.showSubtopics;        
        toggleButton.showSubtopics ? 
            toggleButton.innerHTML = "Hide Subtopics" : toggleButton.innerHTML = "Show Subtopics";
    }



    /* 
    BEGIN TOOL REFERENCE BUILDER 
    */    

    var buildToolReference = function () {
        var tools = document.querySelectorAll('div.tool-reference, div.reference');
        if(tools.length > 0) {
            var toolSection = document.createElement('section');
            var toolSectionTitle = document.createElement('h1');
            toolSectionTitle.innerHTML = 'Reference';
            toolSection.classList.add('topic');
            toolSection.classList.add('reference-section');
            toolSection.appendChild(toolSectionTitle);
            tools.forEach(function(currentItem,currentIndex) {
                var newToolItem = currentItem.cloneNode(true);
                toolSection.appendChild(newToolItem);
            })
            document.querySelector('body').appendChild(toolSection);

        }
    }    
    buildToolReference();


    /*
    BEGIN OUTLINE GENERATOR
    The code below will generate the "topics outline" section of the manual.
    It scans for each <h1> element that is a child of <section> elements with class .topic, then adds it to the topics outline and generates anchor links as child elements of the h1. 

    Then, it scans for 

    Also adds event listener on click, to toggle whether section has the class .collapsed
    */


    // Grab all sections that have class .topic
    var sections = document.querySelectorAll("section.topic");

    // Create <ol> that will house the topics list, add class of "primary-topics"
    var outlineElement = document.createElement('ol');
    outlineElement.classList.add("primary-topics");

    // Grab the #outline element and add the outline <ol> to it
    $("#outline").append(outlineElement);


    // Build outline elements.
    var outlineTitle = document.createElement('h1');
    outlineTitle.innerHTML = "Topics";


    // Create the button to toggle sub-topics
    var outlineToggleButton = document.createElement("button");
    outlineToggleButton.id = "toggle-subtopics";
    outlineToggleButton.innerHTML = "Hide Subtopics";
    outlineToggleButton.showSubtopics = true;
    outlineToggleButton.addEventListener('click',togglePrimaryTopicsOnly);

    // Grab outline element, add classes, then append child elements
    var outline = document.getElementById("outline");
    outline.classList.add("outline-parent")

    outline.appendChild(outlineTitle);
    outline.appendChild(outlineToggleButton);
    outline.appendChild(outlineElement);


    // Create the "Back to Topics" links 
    var topAnchor = document.createElement("a");
    var aText = document.createTextNode('Back to Topics');
    topAnchor.setAttribute('href','#outline');
    topAnchor.setAttribute('class','top-link');
    topAnchor.appendChild(aText);


    try {
        sections.forEach(function(currentSection,currentIndex){
            var newAnchor = topAnchor.cloneNode(true);
            currentSection.appendChild(newAnchor);

        });
            var newAnchor = topAnchor.cloneNode(true);
        newAnchor.setAttribute('id',"back-to-topics-sticky");
        newAnchor.innerHTML = "Top";
        outline.appendChild(newAnchor);
        
    } catch (e) {
        console.log("Error of some sort - send help!");
        console.error(e);
    }



    /*
function getOutlineContents:
Crawls the manual contents to create topics and subtopics from h1 and h2 elements, respectively. 

Returns outlineContents: an array of objects with the following properties:
.primary: a single <h1> element object
.secondary: an array of <h2> element objects
    */

    var getOutlineContents = function() {

        var outlineContents = [];
        sections.forEach(
            function(currentItem, currentIndex,listObj) {
                var currentChildren = currentItem.childNodes;
                var currentOutlineItem = {};
                currentChildren.forEach(
                    function(el) {
                        // If it's an h1 tag, add it as the value for  the currentOutlineItem's .primary property, since each outlineItem should only have 1 primary topic.
                        if (el.nodeName.toLowerCase() == 'h1') {
                            //                        console.log("H1 tag spotted!");
                            currentOutlineItem.primary = el;
                        }
                        else if (el.localName == "h2") {
                            // If it encounteres a node of type h2, check if the 'secondary' property exists. If not, make it. If so, add the h2 to the .secondary array.

                            if(currentOutlineItem.secondary == undefined) 
                            {
                                currentOutlineItem.secondary = [];
                                currentOutlineItem.secondary.push(el); 
                            }
                            else { currentOutlineItem.secondary.push(el); 
                                  //                                                                             console.log(el);
                                  //                                            console.log(currentOutlineItem);
                                 }
                        }
                        //                                            console.log(el);
                        //                                            console.log(currentOutlineItem);
                    })
                // Add the item to the outlineContents array.
                outlineContents.push(currentOutlineItem);
                //                console.log(outlineContents);
            });
        return outlineContents;
    }

    var outlineSource = getOutlineContents();


    outlineSource.forEach(function(listItem,currentIndex) {


        // Add clickability to each section.topic H1
        try {
            if(listItem.hasOwnProperty('primary') || listItem.primary !== undefined) {
                listItem.primary.addEventListener('click',toggleCollapseSection);


                // Build top-level (aka primary) List Items and Links, aka <h1> tags
                listItem.primary.setAttribute("id",listItem.primary.innerText);
                var outlineListItem = document.createElement('li');
                var addAnchor = document.createElement('a');
                addAnchor.setAttribute("href","#"+listItem.primary.innerText);
                addAnchor.innerText = listItem.primary.innerText;


                var outlineListItem = document.createElement('li');
                outlineListItem.setAttribute("id",listItem.primary.innerText+"_link");
                outlineListItem.classList.add("primary-topic");
                outlineListItem.appendChild(addAnchor);
                outlineElement.appendChild(outlineListItem);
            }


            // Add ID to secondary-level List Items, aka <h2> tags
            if(listItem.secondary !== undefined || listItem.hasOwnProperty('secondary')) 
            {
                var outlineSubListElement = document.createElement('ol');
                outlineSubListElement.classList.add("sub-topics");
                //            console.log(outlineSubListElement);

                listItem.secondary.forEach(function (el) {
                    el.setAttribute("id",listItem.primary.innerText+"_"+el.innerText);
                    //                console.log(listItem.primary.innerText+"_link");
                    var lookupID = listItem.primary.innerText+"_link";
                    var outlinePrimaryItem = document.getElementById(lookupID);
                    //                outlineSubListElement.

                    var addSubAnchor = document.createElement('a');
                    addSubAnchor.setAttribute("href","#"+listItem.primary.innerText+"_"+el.innerText);
                    addSubAnchor.innerText = el.innerText;

                    var outlineSubListItem = document.createElement('li');
                    outlineSubListItem.appendChild(addSubAnchor);
                    outlineSubListElement.appendChild(outlineSubListItem);
                    //                console.log(outlineSubListElement);
                    outlinePrimaryItem.appendChild(outlineSubListElement);




                });
            }
        } catch (e) {
            //Catch Statement
            console.error(e);
        }


    });




    // Enable Smooth Scrolling
    var scroll = new SmoothScroll('a[href*="#"]');
    


});
