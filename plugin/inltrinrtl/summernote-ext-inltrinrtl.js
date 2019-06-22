(function (factory) {
  /* global define */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(window.jQuery);
  }
}(function ($) {
  // Extends plugins for adding hello.
  //  - plugin is external module for customizing.
  $.extend($.summernote.plugins, {
    /**
     * @param {Object} context - context object has status of editor.
     */
    'inltrinrtl': function (context) {
      var self = this;

      // ui has renders to build ui elements.
      //  - you can create a button with `ui.button`
      ui = $.summernote.ui,
        $note = context.layoutInfo.note,

        // contentEditable element
        $editor = context.layoutInfo.editor,
        $editable = context.layoutInfo.editable,
        $toolbar = context.layoutInfo.toolbar,

        // add hello button
        context.memo('button.inltrinrtl', function () {
          // create button
          var button = ui.button({
            contents: 'ltr text',
            tooltip: 'Insert LTR In RTL',
            click: function () {
              context.invoke('inltrinrtl.show');
            },
          });

          // create jQuery object from button instance.
          var $hello = button.render();
          return $hello;
        });

      // This method will be called when editor is initialized by $('..').summernote();
      // You can create elements for plugin
      this.initialize = function () {
        var $container = $(document.body);

        this.$dialog = ui.dialog({

          // Set the title for the Dialog. Note: We don't need to build the markup for the Modal
          // Header, we only need to set the Title.
          title: 'درج متن چپ به راست',

          // Set the Body of the Dialog.
          body: '<div class="form-inline"><label>متن LTR: </label><input id="EngInput"  dir="ltr" class="form-control" value="" /></div>',

          // Set the Footer of the Dialog.
          footer: '<button id="InsertEng" class="btn btn-default">درج کردن</button><button id="degBtn" class="btn btn-default pull-left">&deg;</button>'

          // This adds the Modal to the DOM.
        }).render().appendTo($container);
      };

      this.show = function () {

        var editorInfo = {

        };
        this.showexamplePluginDialog(editorInfo).then(function (editorInfo) {
          ui.hideDialog(self.$dialog);
          $note.val(context.invoke('code'));
          $note.change();
        });
      };

      this.showexamplePluginDialog = function (editorInfo) {
        return $.Deferred(function (deferred) {
          ui.onDialogShown(self.$dialog, function () {
            $input = self.$dialog.find('#EngInput');
            $input.focus();
            $degBtn = self.$dialog.find('#degBtn')
            $degBtn.click(function () {
              $input.val($input.val() + '°');
              $input.focus();
            });
            context.triggerEvent('dialog.shown');
            $insertBtn = self.$dialog.find('#InsertEng');
            self.bindEnterKey($input, $insertBtn);
            $insertBtn.click(function (e) {
              e.preventDefault();
              deferred.resolve({

              });
              context.invoke('editor.restoreRange');
              var node = document.createElement('span');
              node.innerHTML = $input.val();
              node.dir = 'ltr';
              if (node) {
                // insert video node
                context.invoke('editor.insertNode', node);
              }
            });
          });
          ui.onDialogHidden(self.$dialog, function () {
            $insertBtn.off('click');
            $input.unbind();
            $degBtn.unbind();
            $input.val('');
            if (deferred.state() === 'pending') deferred.reject();
          });
          ui.showDialog(self.$dialog);
        });
      };

      // This methods will be called when editor is destroyed by $('..').summernote('destroy');
      // You should remove elements on `initialize`.
      this.destroy = function () {
        ui.hideDialog(this.$dialog);
        this.$dialog.remove();
      };

      this.bindEnterKey = function ($input, $btn) {
        $input.on('keypress', function (event) {
          if (event.keyCode === 13) $btn.trigger('click');
        });
      };
    },
  });
}));