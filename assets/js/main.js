$(function () {

    var itl = {};

    itl.document = {

        _target: '.container',
        _sourceClass: 'text-container',
        _sourceId: 'textContainer'

    };

    itl.slide = {

        _class: 'slide',
        _data: {},

        generate: function () {

            var $container = $('#' + itl.document._sourceId),
                $textContent = $container.find('.text-content'),
                content = itl.slide._data.mainText.replace(/\n/g, '<br>'),
                lineLimit = 22,
                lineCount = 0,
                lineHeight = Math.floor($textContent.css('line-height').replace(/[^-\d.]/g, '')),
                $submitBtn = $('.btn[type="submit"]');

            $textContent.html(content);

            $container.removeClass('d-none');
            lineCount = $textContent.height() / lineHeight;
            $container.addClass('d-none');

            if (lineCount > lineLimit) {
                $('.btn-edit').trigger('click');
                alert('Слишком много текста 😢');
            } else {
                itl.image.generate();
            }

        }

    };

    itl.image = {

        _canvas: undefined,

        generate: function () {

            var element = itl.document._sourceId;
            var elementId = '#' + element;
            var $element = $(elementId)[0];

            html2canvas($element, {

                width: 1080,
                height: 1350,
                onclone: function (clonedDocument) {
                    $(clonedDocument).find(elementId).removeClass('d-none');
                    // Removes extra elements and styles to prevent the canvas offset
                    $(clonedDocument).find('.form-container').remove();
                    $(clonedDocument).find('body').css({'padding': 0});
                }

            }).then(function (canvas) {

                itl.image._canvas = canvas;

                var img = new Image();

                img.src = canvas.toDataURL();
                img.className = 'text-img';

                $('.container').append($(img));
                $('.btn-download').removeClass('d-none');

            });

        }

    };

    itl.init = function () {

        var $form = $('form');

        $form.on('submit', function (e) {
            e.preventDefault();
            $form.addClass('d-none');
            $('.btn-edit').removeClass('d-none');

            var formData = $form.serializeArray();

            $(formData).each(function (index, obj) {
                itl.slide._data[obj.name] = obj.value;
            });

            itl.slide.generate();

        });

        $('.btn-edit').on('click', function (e) {
            $('.text-img').remove();
            $('form').removeClass('d-none');
            $(e.target).addClass('d-none');
            $('.btn-download').addClass('d-none');
        });

        $('.btn-download').on('click', function (e) {
            itl.image._canvas.toBlob(function (blob) {
                saveAs(blob, new Date().valueOf() + '.png');
            });
        });

        var $body = $('body'),
            bodyWidth = $body.width(),
            $textContainer = $('#textContainer'),
            textContainerWidth = $textContainer.outerWidth(),
            scale = bodyWidth < textContainerWidth ? bodyWidth / textContainerWidth : 1;

        $textContainer.css('transform', 'scale(' + scale + ')');

        // itl.slide.generate();

    };

    itl.init();

});