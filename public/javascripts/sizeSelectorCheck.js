function validateForm() {
    var selection = document.getElementById("size_selection");
    if(selection.selectedIndex == 0)
    {
        alert("Please select a size.");
        return false;
    }
    return true;
}