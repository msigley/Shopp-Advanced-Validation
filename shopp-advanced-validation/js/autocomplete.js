jQuery(document).ready(function($) {
    // This example uses the autocomplete feature
    // of the Google Places API to help users fill in the information.

    var flag_prompted = false;
    var defaultLat, defaultLng, defaultRad; // geolocation
    var autocomplete_bill, autocomplete_ship;

    var componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'short_name',
        postal_code: 'short_name'
    };

    var Shopp_form = {
        street_number: '-address',
        route: '-address',
        locality: '-city',
        administrative_area_level_1: '-state-menu',
        country: '-country',
        postal_code: '-postcode'
    };

    function initAutocomplete() {
        // Create the autocomplete object, restricting the search
        // to geographical location types.

        // get freegeoip response and set default country and state
        freegeoip();

        // listener for billing address
        if (document.getElementById('billing-address') != null) {

            $("#billing-address").on('focus', function() {
                // use browser for geolocation
                if (!flag_prompted) geolocate();
                if (defaultLat) setradius(autocomplete_bill);
            });

            autocomplete_bill = new google.maps.places.Autocomplete((document.getElementById('billing-address')), {
                types: ['geocode']
            });

            // When the user selects an address from the dropdown,
            // populate the address fields in the form.
            google.maps.event.addListener(autocomplete_bill, 'place_changed', function() {
                fillInAddress(autocomplete_bill, 'billing');
            });

        }

        // lister for shipping address
        if (document.getElementById('shipping-address') != null) {

            $("#shipping-address").on('focus', function() {
                // use browser for geolocation
                if (!flag_prompted) geolocate();
                if (defaultLat) setradius(autocomplete_ship);
            });

            autocomplete_ship = new google.maps.places.Autocomplete((document.getElementById('shipping-address')), {
                types: ['geocode']
            });

            // When the user selects an address from the dropdown,
            // populate the address fields in the form.
            google.maps.event.addListener(autocomplete_ship, 'place_changed', function() {
                fillInAddress(autocomplete_ship, 'shipping');
            });
        }
    }

    function fillInAddress(ref, form) {
        // Get the place details from the autocomplete object.
        var place = ref.getPlace();

        for (var component in componentForm) {
            document.getElementById(form + Shopp_form[component]).value = '';
            document.getElementById(form + Shopp_form[component]).disabled = false;
        }

        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        var arr = {};

        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
                var val = place.address_components[i][componentForm[addressType]];
                arr[addressType] = val;
            }
        }

        // combine street number with street
        if (arr["street_number"] != null) {
            arr["route"] = (arr["route"] != null) ? arr["street_number"] + " " + arr["route"] : arr["street_number"];
            delete arr["street_number"];
        }

        // country needs to be set first
        if (arr["country"] != null) {
            $('#' + form + Shopp_form["country"]).val(arr["country"]).trigger('change'); // trigger Shopp change event to reload list
            $('#' + form + '-xaddress').focus(); // reset focus to 2nd address field
            delete arr["country"]; // remove from list
        }

        for (var key in arr) {
            // set other fields
            $('#' + form + Shopp_form[key]).val(arr[key]);
        }

    }

    function freegeoip() {
        $.ajax({
            url: 'https://freegeoip.net/json/?callback=',
            dataType: 'json',
            type: 'GET',
            crossDomain: true,
            success: function(data) {
                defaultLat = data.latitude;
                defaultLng = data.longitude;
                $("#billing-city").val() || $("#billing-state-menu").val() || ($("#billing-country").val(data.country_code).trigger('change'), $(
                    "#billing-state-menu").val(data.region_code));
                $("#shipping-city").val() || $("#shipping-state-menu").val() || ($("#shipping-country").val(data.country_code).trigger('change'), $(
                    "#shipping-state-menu").val(data.region_code));
            },
            timeout: 4000 // 4 second timeout for freegeoip response
        });
    }

    // Bias the autocomplete object to the user's geographical location,
    // as supplied by the browser's 'navigator.geolocation' object.
    function geolocate() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                // this will override freegeoip settings
                defaultLat = position.coords.latitude;
                defaultLng = position.coords.longitude;
                defaultRad = position.coords.accuracy;
            });
        }

        // only ask once
        flag_prompted = true;
    }

    function setradius(ref) {
        var circle = new google.maps.Circle({
            center: {
                lat: defaultLat,
                lng: defaultLng
            },
            radius: defaultRad
        });
        ref.setBounds(circle.getBounds());
    }

    if (google && google.maps) {
        // Google maps loaded
        initAutocomplete();
    } else {
        // Google maps not loaded
        // Still attempt to set country and state with freegeoip
        freegeoip();
    }

});