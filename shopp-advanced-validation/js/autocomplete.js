jQuery(document).ready(function($) {
            // This example displays an address form, using the autocomplete feature
            // of the Google Places API to help users fill in the information.

            var placeSearch, autocomplete_bill, autocomplete_ship;
            var componentForm = {
                street_number: 'short_name',
                route: 'long_name',
                locality: 'long_name',
                administrative_area_level_1: 'short_name',
                country: 'short_name',
                postal_code: 'short_name'
            };
            var Shoppnames = {
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

                // listener for billing address
                if (document.getElementById('billing-address') !== null) {

                    $("#billing-address").on('focus', function() {
                        geolocate(autocomplete_bill);
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
                if (document.getElementById('shipping-address') !== null) {

                    $("#shipping-address").on('focus', function() {
                        geolocate(autocomplete_ship);
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
                    document.getElementById(form + Shoppnames[component]).value = '';
                    document.getElementById(form + Shoppnames[component]).disabled = false;
                }

                // Get each component of the address from the place details
                // and fill the corresponding field on the form.

                var street_number;

                for (var i = 0; i < place.address_components.length; i++) {
                    var addressType = place.address_components[i].types[0];
                    if (componentForm[addressType]) {
                        var val = place.address_components[i][componentForm[addressType]];

                        // presume there will not be a blank street number, but could be blank street
                        // a little hacky for now
                        if (addressType == 'street_number' && val != null) {
                            street_number = val + ' ';
                        } else {
                            if (addressType == 'route' && street_number != null) {
                                val = street_number + val;
                            }
                            document.getElementById(form + Shoppnames[addressType]).value = val;
                        }
                    }
                }
            }

            // Bias the autocomplete object to the user's geographical location,
            // as supplied by the browser's 'navigator.geolocation' object.
            function geolocate(ref) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        var geolocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        var circle = new google.maps.Circle({
                            center: geolocation,
                            radius: position.coords.accuracy
                        });
                        ref.setBounds(circle.getBounds());
                    });
                }

            }

            initAutocomplete();
            // or use <script src="https://maps.googleapis.com/maps/api/js?signed_in=true&libraries=places&callback=initAutocomplete" async defer><\/script>

        });
