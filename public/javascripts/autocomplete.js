let autocomplete;

function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('address'),
        {
            componentRestrictions: { 'country': ["be"] },
            fields: ["address_components"],
            types: ['address'],
        });
    autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
    const place = autocomplete.getPlace();

    for (const component of place.address_components) {
        const componentType = component.types[0];

        switch (componentType) {
            case "locality":
                document.getElementById('city').value = component.long_name
                break;
            case "country":
                document.getElementById('country').value = component.long_name
                break;
            case "route":
                document.getElementById('street').value = component.long_name
                break;
            case "street_number":
                document.getElementById('number').value = component.short_name
                break;
        }
    }
    document.getElementById('number').focus();
}