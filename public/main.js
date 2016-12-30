$('#balance, #value').mask("#0.00", {reverse: true});
$('#agency, #number').mask('0#');


$('form').submit(function() {
    var valid = true;
    $(this).find('.required').each(function() {
        if($(this).val() == '') {
            valid = false;
            $(this).parent().addClass('has-error');
        } else {
            $(this).parent().removeClass('has-error');
        }
    });

    if (valid && $(this).hasClass('transaction_form')) {
        if ($('#from').val() == $('#to').val()) {
            valid = false;
            $('#from, #to').parent().addClass('has-error');
            window.alert('The destination account cannot be the same as the origin account.');
        }
    }
    return valid;
});
