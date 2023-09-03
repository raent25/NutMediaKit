exports.nut = function ({
  link = 'https://google.com', //tracking link
  autoLink = true, // autocompletion of links on the pre-landing page
  target = true, // open in a new window
  indexLink = false, // should indexing of links be added
  indexName = 'Place', // by which parameter to index links
  back = false, // back button
  backLink = false, // link to the back button, or link by default
  backLinkToken = false, // get parameters for the back link
  refresh = true, // refresh after transitioning to the offer page of the pre-landing
  refreshLink = false, // link to refresh, or link by default
  refreshLinkToken = false, // get parameters for the refresh link
  offer = true, // insert the offer name
  offerName = "Platform", // offer name
  offerNameBlock = ".brandName", // element to insert the offer name
  btc = true, // fetch the Bitcoin exchange rate
  btcRound = 1, // Round to
  currency = "USD", // Currency for display
  getLink = false // Should links be taken from the link with the id getLink
} = {}) {
  try {
    let arrA = document.querySelectorAll('a');
    let brandName = document.querySelectorAll(offerNameBlock);
    if (getLink) {
      link = document.getElementById("getLink");
    }
    if (autoLink) {
      arrA.forEach((item, i) => {
        if (item.getAttribute('data-custom-link')) {
          //script ignore link with data-custom-link
        } else {
          if (!indexLink) {
            item.setAttribute('href', link);
          } else {
            let getParameters = link.includes("?") ? `&${indexName}=${i}` : `?${indexName}=${i}`;
            item.setAttribute('href', link + getParameters);
          }
          item.setAttribute('target', target ? '_blank' : '_self');
        }
      });
    }

    if (back) {
      window.history.pushState({
        page: 1
      }, '', '');
      window.onpopstate = function (event) {
        if (event) {
          let linkForBack = backLink ? backLink : link;
          let getParamsForBack = backLinkToken ? linkForBack.includes("?") ? `&${backLinkToken}` : `?${backLinkToken}` : "";
          window.location.href = linkForBack + getParamsForBack;
        }
      };
    }
    if (refresh) {
      if (target) {
        for (let i = 0; i < arrA.length; i++) {
          arrA[i].addEventListener('click', () => {
            setTimeout(() => {
              let linkForRefresh = refreshLink ? refreshLink : link;
              let getParamsForRefresh = refreshLinkToken ? linkForRefresh.includes("?") ? `&${refreshLinkToken}` : `?${refreshLinkToken}` : "";
              window.location.href = linkForRefresh + getParamsForRefresh;
            }, 1000);

          });
        }
      } else {
        console.error("For refresh to work, the 'target' parameter must not be false, set 'target' to true");
      }
    }
    if (offer) {
      for (let i = 0; brandName.length > i; i++) {
        brandName[i].innerHTML = offerName;
      }
    }
    if (btc) {
      const apiLink = 'https://blockchain.info/ticker';
      var xhr = new XMLHttpRequest();
      xhr.open('GET', apiLink, true);
      xhr.send();
      xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) {
          return;
        }
        if (xhr.status != 200) {
          console.error(xhr.status + ': ' + xhr.statusText)
        } else {
          const bitcoin = JSON.parse(xhr.responseText);
          const ticker = bitcoin[currency.toUpperCase()];
          if (!bitcoin[currency.toUpperCase()]) {
            console.error('Error:', ' parameter currency can only have the following values:USD, EUR, GBP, ARS, AUD, BRL, CAD, CHF, CLP, CNY, CZK, DKK, HKD, HRK, HUF, INR, ISK, JPY, KRW, NZD, PLN, RON, RUB, SEK, SGD, THB, TRY, TWD');
          }
          const price = ticker.buy;
          const bitcoinCourse = Math.round(price / btcRound) * btcRound;
          const bitcoins = document.querySelectorAll(".bitcoinCourse");
          bitcoins.forEach(item => {
            item.innerHTML = bitcoinCourse;
          })
        }
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }

}