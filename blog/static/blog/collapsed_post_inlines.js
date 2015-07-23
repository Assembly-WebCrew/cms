/* collapsed_stacked_inlines.js */
/* Created in May 2009 by Hannes Rydén */
/* Use, distribute and modify freely */

(function ($) {
  $().ready(function () {
    // Only for stacked inlines
    $('div#post_set-group.inline-group div.inline-related:not(.tabular)').each(function () {
      var $this = $(this);
      var fs = $this.find('fieldset');
      var h3 = $this.find('h3:first');

      // Don't collapse if fieldset contains errors
      if (fs.find('div').hasClass('errors') || $this.hasClass('last-related'))
        fs.addClass('stacked_collapse');
      else
        fs.addClass('stacked_collapse collapsed');

      // Add toggle link
      h3.prepend('<a class="stacked_collapse-toggle" href="#">(' + gettext('Show') + ')</a> ');
      h3.find('a.stacked_collapse-toggle').bind("click", function () {
        var $this = $(this);
        fs = $this.parent('h3').next('fieldset');
        if (!fs.hasClass('collapsed')) {
          fs.addClass('collapsed');
          $this.html('(' + gettext('Show') + ')');
        }
        else {
          fs.removeClass('collapsed');
          $this.html('(' + gettext('Hide') + ')');
        }
      }).removeAttr('href').css('cursor', 'pointer');
    });
  });
})(django.jQuery);