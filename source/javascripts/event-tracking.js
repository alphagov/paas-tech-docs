/* eslint-disable no-var, prefer-const */

(function (EventTracking) {
  var $bodyElement = document.querySelector('body')
  var $mainHeading = $bodyElement.querySelector('h1')
  var $searchinput = document.getElementById('search')
  var inputDebounceTimer = null

  EventTracking.init = function () {
    // as we're tracking click al laorund the DOM, for the sake of efficiency,
    // we only add 1 click event listener and do heavy lifting in functions below
    // tech-docs template already adds ton of listeners so not goin overboard
    $bodyElement.addEventListener('click', this.handleClickEvent.bind(this))
    this.checkForErrorPage($mainHeading)

    if ($searchinput) {
      // fire event fucntion only after user stops typing (1sec gap)
      $searchinput.addEventListener('input', function () {
        clearTimeout(inputDebounceTimer)
        inputDebounceTimer = setTimeout(function () {
          this.trackSearch($searchinput.value)
        }.bind(this), 1000)
      }.bind(this))

      // prevent from fuether events being sent when user moves away from the input
      $searchinput.addEventListener('blur', function () {
        clearTimeout(inputDebounceTimer)
      })
    }
  }

  EventTracking.handleClickEvent = function (e) {
    var target = e.target
    var isLink = e.target.nodeName === 'A'
    var isTopNavLink = isLink && target.matches('.govuk-header__link')
    // external links
    var externalLinkRegex = /^(?=.*(http|mailto))(?:(?!cloud\.service\.gov\.uk).)*$/g
    var isExternalLink = isLink && externalLinkRegex.test(target.getAttribute('href'))
    // depending on the area clicked the target could be the button or the span inside it
    var isNavToggleButton = target.matches('.collapsible__toggle') || target.parentNode.matches('.collapsible__toggle')
    var isLinkwithFragment = isLink && target.getAttribute('href').indexOf('#') > -1
    // links in navigation
    var isLinkInNavigation = target.closest('.js-toc-list a')

    // navigation links contain spans
    var isSubLevelNavLink = target.matches('.collapsible__body a') || target.parentNode.matches('.collapsible__body a')
    // not all <li> or <a> that are top level have classes
    var isTopLevelNavLink = target.matches('.js-toc-list > ul > li > a') || target.parentNode.matches('.js-toc-list > ul > li > a')

    if (isNavToggleButton) {
      this.trackToggleButtonCLick(target)
    }

    if (isTopNavLink) {
      this.trackTopNavLinkClick(target)
    }

    if (isExternalLink) {
      this.trackExternalLinkClick(target)
    }

    if (isLinkwithFragment && !isLinkInNavigation) {
      this.trackLinkWithFragmentClick(target)
    }

    if (isSubLevelNavLink) {
      this.trackSubNavLinkClick(target)
    }

    if (isTopLevelNavLink) {
      this.trackTopLevelNavLinkClick(target)
    }
  }

  EventTracking.trackTopNavLinkClick = function (element) {
    var eventParams = {}
    var eventAction = 'Top Menu'

    eventParams.event_category = 'Navigation'
    eventParams.event_label = element.textContent

    this.sendEvent(eventAction, eventParams)
  }

  EventTracking.trackExternalLinkClick = function (element) {
    var eventParams = {}
    var eventAction = element.textContent

    eventParams.event_category = 'External Link Clicked'
    eventParams.event_label = element.getAttribute('href')

    this.sendEvent(eventAction, eventParams)
  }

  EventTracking.trackLinkWithFragmentClick = function (element) {
    var eventParams = {}
    var eventAction = 'Anchor Link'

    eventParams.event_category = 'Click'
    eventParams.event_label = element.textContent

    this.sendEvent(eventAction, eventParams)
  }

  EventTracking.trackToggleButtonCLick = function (element) {
    var targetText = element.textContent ? element.textContent : element.parentNode.textContent
    var eventParams = {}
    var eventAction = 'Side Bar Arrow Click '
    // text toggle (expand/collpase is handle by the template)
    // when we listen to the event, the text has already been tooggled
    //  event label required to send:
    // if collapsed, on click fire 'Side Bar Arrow Click Open'
    // if expanded, on click fire 'Side Bar Arrow Click Close'
    var isCollapsedState = targetText.split('Collapse').length > 1
    var isExpandedSTate = targetText.split('Expand').length > 1

    eventParams.event_category = 'Navigation'

    if (isCollapsedState) {
      eventParams.event_label = (targetText.split('Collapse')[1]).trim()
      eventAction += 'Open'
    }

    if (isExpandedSTate) {
      eventParams.event_label = (targetText.split('Expand')[1]).trim()
      eventAction += 'Close'
    }

    this.sendEvent(eventAction, eventParams)
  }

  EventTracking.trackSubNavLinkClick = function (element) {
    var eventParams = {}
    var eventAction = 'Side Bar Navigation'

    eventParams.event_category = 'Navigation'
    eventParams.event_label = 'Sub | ' + (element.textContent ? element.textContent : element.parentNode.textContent)

    this.sendEvent(eventAction, eventParams)
  }

  EventTracking.trackTopLevelNavLinkClick = function (element) {
    var eventParams = {}
    var eventAction = 'Side Bar Navigation'

    eventParams.event_category = 'Navigation'
    eventParams.event_label = 'Heading | ' + (element.textContent ? element.textContent : element.parentNode.textContent)

    this.sendEvent(eventAction, eventParams)
  }

  EventTracking.checkForErrorPage = function (identifier) {
    // GA needs strings for status code as event labels
    var errorPagesArray = [
      {
        title: 'Page not found',
        statusCode: '404'
      },
      {
        title: 'Sorry, there is a problem with the service',
        statusCode: '500'
      }
    ]
    if (!identifier) return

    var errorPageData = errorPagesArray.filter(function (o) {
      return o.title === identifier.textContent
    })

    if (errorPageData[0]) {
      this.sendEvent(errorPageData[0].statusCode, { event_category: 'Error' })
    }
  }

  EventTracking.trackSearch = function (query) {
    var resultCount = document.getElementById('search-results-title').textContent

    this.sendEvent(resultCount, {
      event_category: 'Site Search',
      event_label: this.PIIfy(query)
    })
  }

  EventTracking.sendEvent = function (eventAction, options) {
    window.dataLayer = window.dataLayer || []
    var gtag = function () {
      dataLayer.push(arguments)
    }

    gtag('event', eventAction, options)
  }

  EventTracking.PIIfy = function (string) {
    var strippedString
    var EMAIL_PATTERN = /[^\s=/?&]+(?:@|%40)[^\s=/?&]+/g
    var NUMBER_PATTERN = /0|1|2|3|4|5|6|7|8|9/g

    strippedString = string
      .replace(
        NUMBER_PATTERN, '[number]'
      ).replace(
        EMAIL_PATTERN, '[email]'
      )

    return strippedString
  }
}(window.EventTracking = window.EventTracking || {}))
