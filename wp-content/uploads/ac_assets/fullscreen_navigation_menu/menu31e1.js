function UCFullscreenMenu(menuWrapperID){
  
  var g_menuWrapper, g_isCloseOnOpen = false, g_isCurrentParentItemOpened = false;
  var g_menuWrapperID = menuWrapperID;
  var g_currentLocation = window.location.href;
  var isIconClicked = false;
  
  /**
  * collapse inner section
  */
  function collapseInnerSection(element, link){
    
    var sectionHeight = element.scrollHeight;
    
    var elementTransition = element.style.transition;
    element.style.transition = '';    
    
    requestAnimationFrame(function() {
      element.style.height = sectionHeight + 'px';
      element.style.transition = elementTransition;
      
      
      requestAnimationFrame(function() {	
        element.style.height = 0 + 'px';
        
      });
    });
    
    element.setAttribute('data-collapsed', 'true');
  }
  
  /**
  * expand the inner of the section
  */
  function expandSectionInner(element){
    var sectionHeight = element.scrollHeight;
    
    element.style.height = sectionHeight + 'px';
    
    element.addEventListener('transitionend', function(e) {
      element.removeEventListener('transitionend', arguments.callee);
      element.style.height = null;
    });
    
    element.setAttribute('data-collapsed', 'false');
    
  }
  
  /**
  * expand section
  */
  function expandSection(section, objLink){
    
    expandSectionInner(section);
   
    section.setAttribute('data-collapsed', 'false')
    objLink.removeClass("collapsed");
    objLink.addClass("expanded");
    
  }
  
  /**
  * collapse the section
  */
  function collapseSection(section, objLink){
    
    collapseInnerSection(section, objLink);
    
    objLink.addClass("collapsed");
    objLink.removeClass("expanded");
  }
  
  /**
  * collapse all expanded sections
  */
  function collapseAllExpanded(clickedItem){

    var clickedParentExpanded = jQuery(clickedItem).parents('.sub-menu').prev();    
    var clickedChildrenExpanded = jQuery(clickedItem).next().find('.expanded'); 
    
    var objAllExpanded = g_menuWrapper.find(".expanded").not(clickedChildrenExpanded).not(clickedParentExpanded);
    
    if(objAllExpanded.length == false)
    return(false);
    
    jQuery.each(objAllExpanded, function(index, link){
      var objLink = jQuery(link);
      var section = link.nextElementSibling;

      collapseSection(section, objLink);      
    });
  }
  
  /**
  * close or open link
  */
  function toggleSection(objLink){
    
    var link = objLink[0];
    var section = link.nextElementSibling;
    
    var isCollapsed = section.getAttribute('data-collapsed') === 'true';
    
    if (isCollapsed) {		//expend current
      
      if(g_isCloseOnOpen == true)
      collapseAllExpanded(link);
      
      expandSection(section, objLink);
      
    } else {		//collapse current
      
      collapseSection(section,objLink);
    }
    
  }
  
  /**
  * open or close some item
  */
  function openCloseItem(link, event){
    
    var section = link.nextElementSibling;
    
    if(!section)
    return(true);
    
    var objSection = jQuery(section);
    if(objSection.hasClass("sub-menu") == false)
    return(true);
    
    if(event)
    event.preventDefault();
    
    var objLink = jQuery(link);    
    var isCollapsed = section.getAttribute('data-collapsed') === 'true';
   
    if (isCollapsed) {		//expend current
      
      if(g_isCloseOnOpen == true)
      collapseAllExpanded(link);
      
      expandSection(section, objLink);
      
    } else {		//collapse current
      
      collapseSection(section,objLink);
    }
    
  }
  
  /**
  * on menu item click, if sub menu, open or close
  */
  function onMenuItemClick(event){   
    openCloseItem(this, event);    
  }
  
  /**
  * console log shorcut
  */
  function trace(str){    
    console.log(str);
  }
  
  /**
  * init from popups
  */
  function checkInitFromPopups(){    
    jQuery( document ).on( 'elementor/popup/show', (event) => {			
      runMenu();
    });    
  }

  
  /**
  * expand current item tree
  */
  function expandCurrentItemTree(){    
    //disable transition    
    var objCurrentItem = g_menuWrapper.find(".uc-list-menu ul .current-menu-item");
    
    if(objCurrentItem.length == 0)
    return(false);
    
    g_menuWrapper.addClass("uc-no-transition");
    
    setTimeout(function(){
      g_menuWrapper.removeClass("uc-no-transition");
    },300);
    
    var objParents = objCurrentItem.parents("li");
    
    if(objParents.length == 0)
    return(false);
    
    jQuery.each(objParents, function(index, parent){      
      var objParent = jQuery(parent);
      var objLink = objParent.children("a");      
      var link = objLink[0];
      
      openCloseItem(link);      
    });    
  }
  
  // collapse all except the current	
  this.collapseAll = function(){    
    g_menuWrapper.find("ul.uc-list-menu li a").each((i, item) => {
      var objLink = jQuery(item);
      
      collapseAllExpanded(objLink[0]);		    
    });
  }
  

  /**
   * expand all
   */
  this.expandAllAfterPageLoad = function(){
    var dataExpandAll = g_menuWrapper.data("expandall");

    if(dataExpandAll == false)
      return(false);

    var objParentItems = g_menuWrapper.find(".menu-item-has-children");

    if(!objParentItems || objParentItems.length == 0)
      return(false);

    //disable transition temporarely
    g_menuWrapper.addClass("uc-no-transition");
    setTimeout(function(){
      g_menuWrapper.removeClass("uc-no-transition");
    },300);

    objParentItems.each(function(){
      var objItem = jQuery(this);
      var objLink = objItem.children("a");      
      var link = objLink[0];
      
      openCloseItem(link); 
    });

  }

  /*
  * open current page menu item
  */
  this.openCurrentPageMenuItem = function(){
    
    g_menuWrapper.find("ul.uc-list-menu li a").each((i, item) => {
      
      var objLink = jQuery(item);
      var section = item.nextElementSibling;  
      var objLinkItemHref = objLink.attr('href');
      
      if(g_currentLocation == objLinkItemHref){
       
        if(jQuery(section) && jQuery(section).length > 0)
        expandSection(section, objLink); 

        var objParentSection = objLink.parents(".sub-menu");

        if(!objParentSection)
        return(true)

        var objParentLink = objParentSection.prev();

        if(!objParentLink)
        return(true)

        if(objParentSection && objParentSection.length > 0)
        expandSection(objParentSection[0], objParentLink);
      }    
    });    
  }
  
  
  /*
  * position fixed protection from parents transform rules
  */
  function protectForFixed(){
    
    //find element with position fixed css rule
    var objFixedElement = g_menuWrapper.parents('.ue_menu');
    
    //find all parents and look at each one
    var objFixedParents = objFixedElement.parents();
    
    objFixedParents.each(function(){
      
      var objFixedParent = jQuery(this);
      
      //check if parent has one of issued css rules
      var transformRule = objFixedParent.css('transform');
      
      //if transform is epsent then skip and move to another css rule
      if(transformRule == 'none')
      return(true);
      
      //if finds transform then remove it
      objFixedParent.css('transform', '');
      
      //animation-fill-mode
      var fillmodeRule = objFixedParent.css('animation-fill-mode');
      
      if(fillmodeRule == 'none')
      return(true);
      
      objFixedParent.css('animation-fill-mode', 'none');
      
      //perspective
      var perspectiveRule = objFixedParent.css('perspective');
      
      if(perspectiveRule == 'none')
      return(true);
      
      objFixedParent.css('perspective', 'none');
      
      //filter
      var filterRule = objFixedParent.css('filter');
      
      if(filterRule == 'none')
      return(true);
      
      objFixedParent.css('filter', 'none');
      
    });
    
  }
  
  
  /**
  * run the menu, init
  */
  this.runMenu = function(){
    
    //init globals
    g_menuWrapper = jQuery("#"+g_menuWrapperID);
    
    g_isCloseOnOpen = g_menuWrapper.data("closeothers");
    g_isCloseOnOpen = (g_isCloseOnOpen == "yes");
    
    var isClickable = g_menuWrapper.data("clickable");
    
    if(g_menuWrapper.length == 0){
      console.log("menu with ID: "+g_menuWrapperID+" not found!");
      
      checkInitFromPopups();
      
      return(false);
    }
    
    //collapse all except the current
    
    g_menuWrapper.find("ul.uc-list-menu li a").each((i, item) => {
      
      if(item.nextElementSibling){
        
        var objItem = jQuery(item);
        var iconPosition = g_menuWrapper.data('icon-position');
        
        if(iconPosition == 'start')
        objItem.prepend("<span class='uc-menu-item-pointer'></span>");
        
        if(iconPosition == 'end')
        objItem.append("<span class='uc-menu-item-pointer'></span>");
        
        collapseInnerSection(item.nextElementSibling, item);
        
        item.nextElementSibling.style.display = "block";
        
        jQuery(item).addClass("collapsed");
        jQuery(item).removeClass("expanded");
      }
      
    });
    
    //init events
    
    if(isClickable == false){
      
      g_menuWrapper.find("ul.uc-list-menu li a").on("click", onMenuItemClick);
      
    }else{
      
      //pointer click - toggle section      
      g_menuWrapper.find("ul.uc-list-menu li .uc-menu-item-pointer").on("click", function(event){       
        isIconClicked = true;

        var objLink = jQuery(this).parent();
        toggleSection(objLink);
      });
      
      g_menuWrapper.find("ul.uc-list-menu li a").on("click", function(e){
        //check if icon was clicked if not make sure that no icon found in clicked link
        if(isIconClicked == true){
          var objIcon = jQuery(this).find(".uc-menu-item-pointer");
    
          if(objIcon && objIcon.length > 0){
            e.preventDefault();
            isIconClicked = false;
          }
        }
      });
    }
    
    //open the section with current item
    
    setTimeout(expandCurrentItemTree,100);
    
    //protection for elements with position fixed rule
    
    setTimeout(protectForFixed,2000);
    
  }
  
  
}