import 'normalize.css';
import 'animate.css';
import '../styles/styles.scss';

!(function(d) {

    const body = document.querySelector( '.page_body' );
    const bannerHeadline = document.querySelector( '#banner-headline' );

    // ANIMATION CODE
    // NOTE: Should find a better solution then to use code for animations
    // user could have Javascript disabled.

    window.addEventListener( 'load', () => {
        bannerHeadline.classList.add( 'animate__fadeInUp' );
        body.style.opacity = 1;
    } );

    // END ANIMATION CODE

    // MOBILE MENU CODE

    const openMenu = document.querySelector( '.nav__open' );
    const closeMenu = document.querySelector( '.nav__close' );
    const html = document.querySelector( 'html' );

    openMenu.addEventListener( 'click', () => {
        html.classList.add( 'mobile-menu__open' );
    } );

    closeMenu.addEventListener( 'click', () => {
        html.classList.remove( 'mobile-menu__open' );
    } );


    // END MOBILE MENU CODE

    var itemClassName = "carousel__photo",
    items = d.getElementsByClassName(itemClassName),
    totalItems = items.length,
    slide = 0,
    moving = true;

    var touchSurface = document.getElementsByClassName( 'carousel' )[0],
        startX,
        startY,
        dist,
        threshold = 150,
        allowedTime = 200,
        elapsedTime,
        touchObj,
        startTime;
    
    function handleSwipe( isRightSwipe ) {
        if( isRightSwipe ) {
            movePrev();
        }
        else {
            moveNext();
        }
    }

    // Set classes
    function setInitialClasses() {
        // Targets the previous, current, and next items
        // This assumes there are at least three items.

        items[totalItems - 1].classList.add( 'prev' );
        items[0].classList.add( "active" );
        items[1].classList.add( "next" );
    }

    function dragStart( e ) {
        e = e || window.event;

        if( e.type === 'touchstart' ) {
            touchObj = e.changedTouches[0];
            startX = touch.pageX;
            startY = touch.pageY;
        }
        else {
            touchObj = e;
            startX = e.pageX;
            startY = e.pageY;
        }
    }

    function dragEnd( e ) {

        dist = touchObj.pageX - startX;
        elapsedTime = new Date().getTime() - startTime;

        if( e.type === 'touchend' ) {
        }
        else {

        }

        var swiperightBol = (elapsedTime <= allowedTime && dist >= threshold && Math.abs(touchObj.pageY - startY) <= 100)
        handleSwipe(swiperightBol);
    }

    // Set event listeners
    function setEventListeners() {
        var next = d.getElementsByClassName( 'carousel__button--next' )[0],
            prev = d.getElementsByClassName( 'carousel__button--prev' )[0];

        next.addEventListener( 'click', moveNext );
        prev.addEventListener( 'click', movePrev );

        touchSurface.addEventListener( 'mousedown', function( e ) {
            e.preventDefault();
            startX = e.pageX;
            startY = e.pageY;
            startTime = new Date().getTime();

            console.log( 'pageX: ', e.pageX, ' ', 'pageY: ', e.pageY );
        }, false );

        touchSurface.addEventListener( 'mousemove', function( e ) {
            e.preventDefault();
        }, false );

        touchSurface.addEventListener( 'mouseup', function( e ) {
            dist = e.pageX - startX;
            elapsedTime = new Date().getTime() - startTime;
            var swiperightBol = (elapsedTime <= allowedTime && dist >= threshold && Math.abs(e.pageY - startY) <= 100)
            handleSwipe(swiperightBol);
            e.preventDefault();

            console.log( 'distance traveled: ', e.pageX - startX );
        }, false );

        touchSurface.addEventListener('touchstart', function( e ) {
            var touchobj = e.changedTouches[0]
            dist = 0
            startX = touchobj.pageX;
            startY = touchobj.pageY;
            startTime = new Date().getTime() // record time when finger first makes contact with surface
            e.preventDefault();
        }, false)
     
        touchSurface.addEventListener('touchmove', function( e ) {
            e.preventDefault() // prevent scrolling when inside DIV
        }, false)
     
        touchSurface.addEventListener('touchend', function( e ) {
            var touchobj = e.changedTouches[0]
            dist = touchobj.pageX - startX // get total dist traveled by finger while in contact with surface
            elapsedTime = new Date().getTime() - startTime // get time elapsed
            // check that elapsed time is within specified, horizontal dist traveled >= threshold, and vertical dist traveled <= 100
            var swiperightBol = (elapsedTime <= allowedTime && dist >= threshold && Math.abs(touchobj.pageY - startY) <= 100)
            handleSwipe(swiperightBol)
            e.preventDefault()
        }, false)
    }

    function disableInteraction() {
        // Set 'moving' to true for the same duration as our transition
        // ( 0.5s = 500ms )

        moving = true;

        // setTimeout runs its function once after the given time
        setTimeout( function() {
            moving = false;
        }, 500 );
    }

    // Next navigation handler
    function moveNext() {
        // Check if moving
        if( !moving ) {

            // If it's the last slide, reset to 0, else +1
            if( slide === ( totalItems - 1 ) ) {
                slide = 0;
            }
            else {
                slide ++;
            }

            // Move carousel to updated slide
            moveCarouselTo( slide );
        }
    }

    function movePrev() {

        // Check if moving
        if( !moving ) {
            // If it's the first slide, set as the last slide, else -1
            if( slide === 0 ) {
                slide = ( totalItems - 1 );
            }
            else {
                slide--;
            }

            // Move carousel to updated slide
            moveCarouselTo( slide );
        }
    }

    function moveCarouselTo( slide ) {
        // Check if carousel is moving, if not, allow interaction
        if( !moving ) {
            // temporarily disable interactivity
            disableInteraction();

            // Update the "old" adjacent slides with the "new" ones
            var newPrevious = slide - 1,
                newNext = slide + 1,
                oldPrevious = slide - 2,
                oldNext = slide + 2;

            // Test if carousel has more than three items
            if( ( totalItems - 1 ) >= 3 ) {
                // Checks and updates if the new slides are out of bounds
                if( newPrevious <= 0 ) {
                    oldPrevious = ( totalItems - 1 );
                }
                else if( newNext >= ( totalItems - 1 ) ) {
                    oldNext = 0;
                }

                // Checks and updates if slide is at the beginning/end
                if( slide === 0 ) {
                    newPrevious = ( totalItems - 1 );
                    oldPrevious = ( totalItems - 2 );
                    oldNext = ( slide + 1 );
                }
                else if( slide === ( totalItems - 1 ) ) {
                    newPrevious = ( slide - 1 );
                    newNext = 0;
                    oldNext = 1;
                }

                // Now we've worked out where we are and where we're going,
                // by adding/removing classes we'll trigger the transitions.

                // Reset old next/prev elements to default classes
                items[oldPrevious].className = itemClassName;
                items[oldNext].className = itemClassName;

                // Add new classes
                items[newPrevious].className = itemClassName + " prev";
                items[slide].className = itemClassName + " active";
                items[newNext].className = itemClassName + " next";
            }
        }
    }

    function initCarousel() {
        setInitialClasses();
        setEventListeners();

        // Set moving to false so that the carousel becomes interactive
        moving = false;
    }

    initCarousel();

})(document);