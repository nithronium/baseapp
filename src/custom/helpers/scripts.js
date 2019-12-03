import * as $ from 'jquery';
//tslint:disable
function replaceHLink() {
    $('.hlink').each(function(index) {
        $(this).removeClass('hlink').addClass('olink');
        var arr = $.map(this.attributes, function (attribute) {
            if (attribute.name !== 'data-href') {
                return attribute.name + '="' + attribute.value + '"';
            }
        });

        $(this).replaceWith('<a ' + arr.join(' ') + ' href="'
            + atob($(this).attr('data-href')) + '">' + $(this).html() + '</a>');
    });
};
export default replaceHLink;