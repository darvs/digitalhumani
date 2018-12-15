
// CONFIGURATION
var base = "https://3ib0d53ao8.execute-api.ca-central-1.amazonaws.com/dev";

$(function() {
  $("#tabs").tabs({
    active: 0
  });

  $(".accordion").accordion({
    active: 1,
    heightStyle: "content",
    collapsible: true,
  });

  doGet = doVerb.bind(null, 'GET');
  doDelete = doVerb.bind(null, 'DELETE');
  doPost = doVerbWithPayload.bind(null, 'POST');
  doPatch = doVerbWithPayload.bind(null, 'PATCH');

  $(".get-request").click(doGet)
  $(".delete-request").click(doDelete)
  $(".post-request").click(doPost)
  $(".patch-request").click(doPatch)

  function doVerb (verb, ev) {
    var $root = $(ev.currentTarget)
    var $form = $root.find('FORM');

    var $target = $(ev.target)

    if ($target.hasClass('send')) { // [Send] button click

      var path = $root.data('ref').trim()

      var pathNodes = path
        .trim()
        .split('/')

      // Replace all params in path
      $form.children().each(function (idx, group) {
        var param = ':' + $(group).data('ref').trim()
        pathNodes = pathNodes
          .map(function (x) {
            return x === param ? $(group).find('input').val() : x;
          })
      })

      path = pathNodes.join('/')
      var url = base + path;

      // Bring back [Clear] button
      $root.find('.clear').removeClass('d-none');

      // Update and show HTML Request Feedback
      $root.find('.url').html(verb + ' ' + url);
      $root.find('.request').removeClass('d-none');

      $
        .ajax({
          url: url,
          type: verb,
          dataType: "json",
        })
        .done(function (data, textStatus, jqXHR) {
          // Update HTML Response feedback
          $root.find('.response')
            .html(JSON.stringify(data, null, 2))
            .removeClass('bg-warning')
            .addClass('bg-white');
        })
        .fail(function (jqXHR, textStatus, error) {
          // Update HTML Response feedback
          $root.find('.response').html(JSON.stringify(jqXHR, null, 2))
            .removeClass('bg-white')
            .addClass('bg-warning');
        })
        .always(function () {
          // Show HTML Response feedback
          $root.find('.response').removeClass('d-none');
        });

    } else if ($target.hasClass('clear')) { // Button [Clear] clicked
      // Hide, then clear Request feedback
      $root.find('.request').addClass('d-none');
      $root.find('.url').html('');

      // Hide, then clear Response feedback
      $root.find('.response').addClass('d-none');
      $root.find('.response').html('');

      // Hide [Clear] button
      $root.find('.clear').addClass('d-none');
    }
  }

  function doVerbWithPayload (verb, ev) {
    var $root = $(ev.currentTarget)
    var $form = $root.find('FORM');

    var $target = $(ev.target)

    if ($target.hasClass('send')) { // [Send] button click

      var path = $root.data('ref').trim()
      var pathNodes = path.trim().split('/')

      // Build JSON Data Payload
      // Replace all params in path
      var payload = {};
      $form.children().each(function (idx, group) {
        var ref = $(group).data('ref').trim()
        var value = $(group).find('input').val()

        if (pathNodes.includes(':' + ref)) { // This is a param to replace in URL
          var param = ':' + ref
          pathNodes = pathNodes.map(function (x) {
            return x === param ? value : x;
          })
        } else { // This is a path to add to payload
          if (value) { // Skip all empty value
            var dataPath = ref.split('.')
            dataPath.reduce(function (acc, item, idx) {
              if (idx < dataPath.length - 1) { // It's a branch (not the leaf)
                if (!acc.hasOwnProperty(item)) {
                    acc[item] = {};
                }
              } else { // It's the leaf
                acc[item] = item === 'treeCount' ? Number(value) : value;
              }

              return acc[item];
            }, payload)
          }
        }
      })

      path = pathNodes.join('/')
      var url = base + path;

      // Bring back [Clear] button
      $root.find('.clear').removeClass('d-none');

      // Update and show HTML Request Feedback
      $root.find('.url').html(verb + ' ' + url);
      $root.find('.body').html(JSON.stringify(payload));
      $root.find('.request').removeClass('d-none');

      $
        .ajax({
          url: url,
          type: verb,
          data: JSON.stringify(payload),
          contentType:"application/json; charset=utf-8",
          dataType: "json",
        })
        .done(function (data, textStatus, jqXHR) {
          // Update HTML Response feedback
          $root.find('.response')
            .html(JSON.stringify(data, null, 2))
            .removeClass('bg-warning')
            .addClass('bg-white');
        })
        .fail(function (jqXHR, textStatus, error) {
          // Update HTML Response feedback
          $root.find('.response')
            .html(JSON.stringify(jqXHR, null, 2))
            .removeClass('bg-white')
            .addClass('bg-warning');
        })
        .always(function () {
          // Show HTML Response feedback
          $root.find('.response').removeClass('d-none');
        });

    } else if ($target.hasClass('clear')) { // Button [Clear] clicked
      // Hide, then clear Request feedback
      $root.find('.request').addClass('d-none');
      $root.find('.url').html('');
      $root.find('.body').html('');

      // Hide, then clear Response feedback
      $root.find('.response').addClass('d-none');
      $root.find('.response').html('');

      // Hide [Clear] button
      $root.find('.clear').addClass('d-none');
    }
  }
});
