var totalPCount = 0,
    totalPAmt = 0;
var filterTerm;
var currentURL = window.location.href;
var winHeight = $(window).height();
var addedPQuant = [];
var searchKeyword = 'adobe';
var curDay = new Date(); //Current Date
var rangeEnd;


$(document).ready(function () {
    //    tooltip();
    checkFromUrl();
    addToCart();
    lazyLoading();
    showShoppingCart();
    deleteProduct();
    continueShopping();
    search();
});


$(window).load(function () {
    if (currentURL.indexOf("?key") < 0) {
        currentURL += '?key=adobe';
        history.pushState({
            id: ''
        }, 'MADOS | Cart', currentURL);
    }
})
/*START: Loading tweets as per the product search*/

function checkFromUrl() {
    if (currentURL.split("=")[1] == "") {
        filterTerm = 'adobe';
        rangeEnd = rangeStart + 4;
        getData(rangeEnd);
        return;
    }
    if (currentURL.indexOf("xd") >= 0) {
        filterTerm = 'xd';
        getData(rangeEnd);
        return;
    }
    if (currentURL.indexOf("photoshop") >= 0) {
        filterTerm = 'photoshop';
        getData(rangeEnd);
        return;
    }
}
/*END: Loading tweets as per the product search*/

/*START: Show Loader*/
function showLoader() {
    $('.loader').removeClass('hide');
}
/*End: Show Loader*/

/*START: Hide Loader*/
function hideLoader() {
    $('.loader').addClass('hide');
}
/*End: Hide Loader*/

/*START: Tooltip*/
function tooltip() {
    var ele;
    $(document).on('click', '.tooltip-info', function () {
        ele = $(this);
        ele.closest('.tooltip-wrapper').toggleClass('show');
    });
}
/*End: Tooltip*/

var returnData,
    totalTweet;
/*START: Fetch Data*/
function getData(rangeEnd) {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = "https://aravindtwitter.herokuapp.com/twittersearch?key=adobe";

    $.ajax({
        url: proxyurl + url,
        type: 'get',
        dataType: 'json',
        contentType: 'application/json'
    }).pipe(
        function (returnData) {
            console.log(returnData);
            totalTweet = returnData.statuses.length;
            setTimeout(function () {
                hideLoader();
                if (rangeEnd === undefined) {
                    populateData(returnData, rangeEnd, filterTerm);
                } else {
                    populateData(returnData, rangeEnd, filterTerm);
                }
            }, 200);
        },
        function (jqXHR, textStatus, errorThrown) {}
    );



}
/*END: Fetch Data*/



/*START: Populate Data*/
var rangeStart = 0;
var btnHTML = '<div class="btn-input-wrapper"><button class="btn primary-btn add-to-cart" type="button">Add to Cart</button><em class="placeholder">Quantity</em><input class="form-input" type="number" max="10" min="1" value="1"></div>'

function populateData(returnData, rangeEnd) {
    var price, discount, finalPrice;
    //    +returnData[i].img_url +
    //    (rangeStart + 4)
    if (rangeEnd === undefined) {
        rangeEnd = returnData.statuses.length;
    }
    for (var i = rangeStart; i <= rangeEnd; i++) {
        if (i < totalTweet) {
            var tweetCreated = returnData.statuses[i].created_at;

            //Calculating time 
            var tweetTime = timeDiff(curDay, tweetCreated);

            populateTweets(returnData, i, tweetTime, filterTerm);
        }
    }
//    filter(filterTerm);
}

/*END: Populate Data*/

/*START: Populate Tweets into DOM*/
function populateTweets(returnData, i, tweetTime) {
    //Populating Teweets
    $('.tweet-list').append('<li class="tweet-item flex-wrapper"><div class="tooltip-wrapper tweet-user-info"><div class="tooltip-info"><img class="profile-img" src="' + returnData.statuses[i].user.profile_image_url_https + '" alt="' + returnData.statuses[i].user.screen_name + '" /></div><div class="tooltip-content rel-wrapper"><div class="rel-wrapper"><div class="tooltip-content-header flex-wrapper"><img class="profile-img" src="' + returnData.statuses[i].user.profile_image_url_https + '" alt="' + returnData.statuses[i].user.screen_name + '"  /><button class="btn secondary-btn" type="btn">Follow</button></div><div class="tooltip-content-body"><div class="user-name-block"><h3 class="user-name">' + returnData.statuses[i].user.name + '</h3><h5 class="user-handle">@' + returnData.statuses[i].user.screen_name + '</h5></div><p class="user-bio">' + returnData.statuses[i].user.description + '</p><div class="user-follow-wrapper flex-wrapper"><span class="user-follow-ietm"><em>' + returnData.statuses[i].user.friends_count + '</em> Following</span><span class="user-follow-ietm"><em>' + returnData.statuses[i].user.followers_count + '</em> Followers</span></div></div></div></div></div><div class="tweet-content-info"><div class="tweet-info-wrapper"><div class="flex-wrapper flex-align-center"><div class="user-name-block"><h3 class="user-name">' + returnData.statuses[i].user.name + '</h3><h5 class="user-handle">@' + returnData.statuses[i].user.screen_name + '</h5></div><span class="tweet-time">' + tweetTime + '</span></div><div class="tweet-content"><p class="tweet-msg">' + returnData.statuses[i].text + '</p><img class="tweet-img" src="" alt="" /></div></div><div class="tweet-respond-wrapper flex-wrapper"><span class="tweet-respond-item tweet-comment"><i class="far fa-comment"></i> <em></em></span><span class="tweet-respond-item tweet-retweet"><i class="fas fa-retweet"></i> <em></em></span><span class="tweet-respond-item tweet-like"><i class="far fa-heart"></i> <em></em></span><span class="tweet-respond-item tweet-share"><i class="far fa-share-square"></i> <em></em></span></div></div></li>');
}
/*END: Populate Tweets into DOM*/


/*START: Calculate Time*/
function timeDiff(curDay, tweetCreated) {
    var tweetDate = new Date(tweetCreated);
    var diff = curDay.valueOf() - tweetDate.valueOf();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);
    if (hours > 0) {
        if (hours >= 24) {
            hours = parseInt((hours / 24));
            return hours + "day";
        } else {
            return hours + "h " + minutes + "m";
        }
    } else {
        return minutes + "m";
    }
}

/*END: Calculate Time*/

/*START: Lazy Loading*/
function lazyLoading() {
    var ele, docHeight, scrollTop;
    $(window).scroll(function (e) {
        docHeight = $(document).height();
        scrollTop = $(window).scrollTop() + $(window).height();
        //Works only when its not in cart view
        if ($('.tweet-list .tweet-item').length < (totalTweet - 1)) {
            if (scrollTop >= docHeight) {
                rangeStart = $('.tweet-list .tweet-item').length;
                rangeEnd = rangeStart + 4;
                showLoader();
                setTimeout(function () {
                    getData(rangeStart, rangeEnd);
                }, 200);
            }
        }
    });

}

/*END: Lazy Loading*/

/*START: Add to Cart*/
function addToCart() {
    var count = 0,
        samePCount,
        pQuant,
        ele, pID, productHTML;
    var pIDArr = [];
    $(document).on('click', '.btn.add-to-cart', function () {
        pIDArr = []; //Assigning again to blank
        ele = $(this);
        pID = ele.closest('.product-item').find('.p-id').html();
        pQuant = ele.closest('.product-item').find('.form-input').val();

        if ($('.shopping-cart .tooltip-content-list .product-item').length >= 1) {

            //Creating an array with all the existing product ID in the cart
            $('.shopping-cart .product-item').each(function () {
                pIDArr.push($(this).find('.p-id').html());
            });

            //Base on the condition appending the product into cart and shwoing the added product number 
            for (var i = 0; i <= pIDArr.length; i++) {
                if (pIDArr.indexOf(pID) >= 0) {
                    samePCount = $('.shopping-cart .tooltip-content-list .product-item:nth-child(' + ((pIDArr.indexOf(pID)) + 1) + ') .form-input').val();
                    samePCount++;
                    totalPCount++;
                    $(this).find('.btn-input-wrapper input').val(samePCount);
                    break;
                } else {
                    productHTML = ele.closest('.product-item')[0].outerHTML;
                    $('.shopping-cart .tooltip-content-list').append(productHTML);
                    addedPQuant.push(pQuant);
                    count++;
                    totalPCount++;
                    $('.shopping-cart .tooltip-info em').html(count);
                    samePCount = 0;
                    break;
                }
            }

        } else { //For the first instance when the cart is empty
            count++;
            totalPCount++;
            $('.shopping-cart .tooltip-content-list').html(ele.closest('.product-item')[0].outerHTML);
            $('.shopping-cart .tooltip-info em').addClass('show').html(count);
            addedPQuant.push(pQuant);
            $('.shopping-cart').addClass('has-value');

        }

    });
}
/*END: Add to Cart*/

/*START: Show Shopping Cart*/
function showShoppingCart() {
    var pPrice, count = 0;
    $(document).on('click', '.shopping-cart.has-value', function () {
        $('body').addClass('show-cart');
        currentURL = window.location.href;
        if (currentURL.split('/').indexOf('cart') < 0) {
            currentURL += 'cart';
        }
        $('.product-list').html(''); //Emptying the product display view
        history.pushState({
            id: 'cart'
        }, 'MADOS | Cart', currentURL);
        $('.shopping-cart .product-item').each(function () {
            pPrice = parseFloat($(this).find('.p-final-price').html().split(" ")[1]);
            totalPAmt += pPrice;
        });
        $('.cart-wrapper').show();
        $('.cart-wrapper .total-cart-item').html(totalPCount);
        $('.cart-wrapper .total-amt em').html(totalPAmt);
        $('.cart-list').html($('.shopping-cart .tooltip-content-list').html()); //Populating the Cart view
        setTimeout(function () {
            $('.cart-list .product-item').each(function () {
                pQuant = $(this).attr('quantity');
                $(this).find('.form-input').val(addedPQuant[count]);
                $(this).append('<i class="far fa-trash-alt delete-btn" title="Delete"></i>');
                count++;
            });
        }, 100);

    });
}
/*END: Show Shopping Cart*/

/*START: Delete Product from Cart*/
function deleteProduct() {
    var ele, count, price;
    $(document).on('click', '.product-item .delete-btn', function () {
        ele = $(this);
        count = ele.closest('.product-item').find('.form-input').val();
        price = parseFloat(ele.closest('.product-item').find('.p-final-price').html().split(" ")[1]);
        ele.closest('.product-item').remove();
        totalPCount = $('.cart-wrapper .product-item').length;
        totalPAmt = totalPAmt - price; //Re-assigning the current value
        $('.cart-wrapper .total-cart-item, .shopping-cart em').html(totalPCount);
        $('.cart-wrapper .total-amt em').html(totalPAmt);
    });
}
/*END: Delete Product from Cart*/

/*START: Start Shopping from empty cart*/
function continueShopping() {
    $(document).on('click', '.continue-shopping', function () {
        currentURL = currentURL.split('cart')[0];
        history.pushState({
            id: ''
        }, 'MADOS | Products', currentURL);
        rangeStart = 0;
        getData();
        $('.cart-wrapper').hide();
    });
}
/*END: Start Shopping from empty cart*/


/*START: Search*/
function search() {
    $(document).on('keyup', '.search-wrapper .form-input', function () {
        filterTerm = $(this).val().toUpperCase();
        filter(filterTerm);
    })
}
/*END: Search*/

/*START: Search*/
function filter(filterTerm) {
    var targetText, txtValue;
    if (filterTerm.length >= 1) {
        for (var i = 0; i < $('.tweet-list .tweet-item').length; i++) {
            targetText = $('.tweet-list .tweet-item:nth-child(' + (i + 1) + ') .tweet-msg')[0];
            txtValue = targetText.textContent || targetText.innerText;
            if (txtValue.toUpperCase().indexOf(filterTerm) > -1) {
                $('.tweet-list .tweet-item:nth-child(' + (i + 1) + ')').show();
            } else {
                $('.tweet-list .tweet-item:nth-child(' + (i + 1) + ')').hide();
            }
        }
    } else {
        $('.tweet-list .tweet-item').show();
    }
}
/*END: Search*/
