import 'normalize.css';
import 'animate.css';
import '../styles/styles.scss';

!(function(d) {

    const body = document.querySelector( '.page_body' );
    const bannerHeadline = document.querySelector( '#banner-headline' );
    const portfolioLink = document.querySelector( '#portfolio-cta' );
    const portfolio = document.querySelector( '#portfolio' );
    const links = document.querySelectorAll( '.jump' );
    
    for( let i = 0; i < links.length; i++ ) {
        links[i].addEventListener( 'click', e => {
            e.preventDefault();
            window.scrollTo( {
                top: elementPosition( document.querySelector( links[i].hash ) ),
                behavior: 'smooth'
            } );
        } );
    }

    function elementPosition( el ) {
        if( el === null ) {
            return;
        }
        return window.pageYOffset + el.getBoundingClientRect().top;
    }

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
        startTime;

    // Set classes
    function setInitialClasses() {
        // Targets the previous, current, and next items
        // This assumes there are at least three items.

        items[totalItems - 1].classList.add( 'prev' );
        items[0].classList.add( "active" );
        items[1].classList.add( "next" );
    }

        // Set event listeners
        function setEventListeners() {
            var next = d.getElementsByClassName( 'carousel__button--next' )[0],
                prev = d.getElementsByClassName( 'carousel__button--prev' )[0];
    
            next.addEventListener( 'click', moveNext );
            prev.addEventListener( 'click', movePrev );
    
            touchSurface.addEventListener( 'mousedown', function( e ) {
                e.preventDefault();
                dragStart( e );
            }, false );
    
            touchSurface.addEventListener( 'mousemove', function( e ) {
                e.preventDefault();
            }, false );
    
            touchSurface.addEventListener( 'mouseup', function( e ) {
                e.preventDefault();
                dragEnd( e ); 
            }, false );
    
            touchSurface.addEventListener('touchstart', function( e ) {
                e.preventDefault();
                dragStart( e ); 
            }, false )
         
            touchSurface.addEventListener('touchmove', function( e ) {
                e.preventDefault();
            }, false )
         
            touchSurface.addEventListener('touchend', function( e ) {
                e.preventDefault();
                dragEnd( e );
            }, false )
        }

    function dragStart( e ) {
        e = e || window.event;

        e.preventDefault();

        var touchObj = e || e.changedTouches[0];
        startX = touchObj.pageX;
        startY = touchObj.pageY;
        startTime = new Date().getTime();
    }

    function dragEnd( e ) {
        var touchObj = e || e.changedTouches[0];

        e.preventDefault();

        dist = touchObj.pageX - startX;
        elapsedTime = new Date().getTime() - startTime;

        var swipeRight = (elapsedTime <= allowedTime && dist >= threshold && Math.abs(touchObj.pageY - startY) <= 100);

        handleSwipe( swipeRight, e );
    }

    function handleSwipe( isRightSwipe, e ) {
        if( e.target.href ) {
            window.open( e.target.href, '_blank' );
        }
        if( dist === 0 ) {
            e.preventDefault()
        }
        else if( isRightSwipe ) {
            movePrev();
        }
        else {
            moveNext();
        }
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