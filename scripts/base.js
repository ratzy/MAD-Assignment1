var totalPCount = 0,
    totalPAmt = 0;
var currentURL = window.location.href;
var winHeight = $(window).height();
var addedPQuant = [];
$(document).ready(function () {
    //    tooltip();
    getData();
    addToCart();
    lazyLoading();
    showShoppingCart();
    deleteProduct();
    continueShopping();
});


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

var returnData, totalProduct;
/*START: Fetch Data*/
function getData() {
    $.ajax({
        url: 'https://api.myjson.com/bins/qhnfp',
        type: 'get',
        dataType: 'json',
        contentType: 'application/json'
    }).pipe(
        function (returnData) {
            console.log(returnData);
            totalProduct = returnData.length;
            setTimeout(function () {
                hideLoader();
                populateData(returnData);
            }, 200);
        },
        function (jqXHR, textStatus, errorThrown) {}
    );
}
/*END: Fetch Data*/



/*START: Populate Data*/
var rangeStart = 0;
var btnHTML = '<div class="btn-input-wrapper"><button class="btn primary-btn add-to-cart" type="button">Add to Cart</button><em class="placeholder">Quantity</em><input class="form-input" type="number" max="10" min="1" value="1"></div>'

function populateData(returnData) {
    var price, discount, finalPrice;
    //    +returnData[i].img_url +
    for (var i = rangeStart; i <= (rangeStart + 4); i++) {
        if (i < totalProduct) {
            var price = returnData[i].price;
            var discout = returnData[i].discount;
            var finalPrice = price - (price * (discout / 100));
            $('.product-list').append('<li class="product-item"><img src="./images/t.jpeg"><div class="p-details"><em class="p-id">' + returnData[i].id + '</em><div class="p-name-block"><h3 class="p-name">' + returnData[i].name + '</h3><span class="p-type">' + returnData[i].type + '</span></div><div class="p-price-block"><h5 class="p-final-price">Rs. ' + finalPrice + '</h5><em class="p-price">Rs. ' + price + '</em><em class="p-discount">(' + discout + ' % Off)</em></div>' + btnHTML + '</div></li>');
        }
    }
}
/*END: Populate Data*/

/*START: Lazy Loading*/
function lazyLoading() {
    var ele, docHeight, scrollTop;
    $(window).scroll(function (e) {
        docHeight = $(document).height();
        scrollTop = $(window).scrollTop() + $(window).height();
        //Works only when its not in cart view
        if ((!$('body').hasClass('show-cart')) && $('.product-list .product-item').length < (totalProduct - 1)) {
            if (scrollTop == docHeight) {
                rangeStart = $('.product-list .product-item').length;
                showLoader();
                setTimeout(function () {
                    getData();
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
    var filterTerm, targetText, txtValue;
    filterTerm = $('.search-wrapper .form-input').val().toUpperCase();
    if (filterTerm.length >= 1) {
        for (var i = 0; i < $('.product-list .product-item').length; i++) {
            targetText = $('.product-list .product-item:nth-child(' + (i + 1) + ') .p-type')[0];
            txtValue = targetText.textContent || targetText.innerText;
            if (txtValue.toUpperCase().indexOf(filterTerm) > -1) {
                $('.product-list .product-item:nth-child(' + (i + 1) + ')').show();
            } else {
                $('.product-list .product-item:nth-child(' + (i + 1) + ')').hide();
            }
        }
    } else {
        $('.product-list .product-item').show();
    }
}
/*END: Search*/
