$(function () {

    var itl = {};

    itl.form = {

        _id: '#form',
        _input: '#textInput'

    };

    itl.slide = {

        _id: 'slide',
        _class: 'slide',
        _qty: 0,

        generate: function (sourceText) {

            var $firstSlide = $('<div class="slide"></div>');

            $firstSlide.html(itl.slide.addBreaks(sourceText));
            itl.slide.split($firstSlide, sourceText);

        },

        split: function ($firstSlide, sourceText) {
            var currentString = sourceText,
                lastWordIndex,
                lastNewLineIndex,
                removeIndex,
                stringLeftover;

            itl.slide._qty += 1;

            $('body').append($firstSlide.attr('id', itl.slide._id + '-' + itl.slide._qty));

            while (currentString.length && itl.slide.checkOverflow($firstSlide)) {
                lastWordIndex = currentString.lastIndexOf(' ');
                lastNewLineIndex = currentString.lastIndexOf('\n');
                removeIndex = Math.max(lastWordIndex, lastNewLineIndex);
                // Split by space or new line, depending on what goes first from end
                currentString = currentString.substring(0, removeIndex);
                $firstSlide.html(itl.slide.addBreaks(currentString));
            }

            stringLeftover = sourceText.substring(currentString.length);

            if (stringLeftover.length) {
                var $nextClone = $firstSlide.clone().attr('id', itl.slide._id + '-' + itl.slide._qty);
                $firstSlide.after($nextClone);
                $nextClone.html(itl.slide.addBreaks(stringLeftover));
                itl.slide.split($nextClone, stringLeftover);
            } else {
                itl.image.generate($('.slide'));
            }
        },

        checkOverflow: function ($slide) {
            return $slide[0].scrollHeight > $slide.innerHeight();
        },

        addBreaks: function (sourceText) {
            return sourceText.trim().replace(/\n/g, '<br>');
        }

    };

    itl.image = {

        _canvas: undefined,
        _count: 0,

        generate: function ($slides) {

            if (itl.image._count >= $slides.length) {
                return;
            }

            html2canvas($slides[itl.image._count], {

                width: 1080,
                height: 1350,
                onclone: function (clonedDocument) {
                    // Removes extra elements and styles to prevent the canvas offset
                    $(clonedDocument).find(itl.form._id).remove();
                    $(clonedDocument).find('body').css({'padding': 0});
                }

            }).then(function (canvas) {

                itl.image._canvas = canvas;

                var img = new Image(),
                    imgLink = $('<a></a>');

                img.src = canvas.toDataURL();

                imgLink.addClass('text-img')
                        .attr({
                            'data-order': itl.image._count + 1,
                            'href': img.src,
                            'download': 'itl_' + new Date().valueOf() + '.png'
                        })
                        .append(img);

                $('body').append(imgLink);

                itl.image._count++;
                itl.image.generate($slides);

            });

        }

    };

    itl.init = function () {

        $(itl.form._id).on('submit', function (e) {
            e.preventDefault();

            var $form = $(this);

            $form.addClass('d-none');
            itl.slide.generate($form.find(itl.form._input).val());

        });

    };

    itl.init();

});