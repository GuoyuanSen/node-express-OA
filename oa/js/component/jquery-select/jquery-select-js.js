/**
 * Created by IDHorse on 2017/2/21.
 */
;(function($,window,document){

    var pluginName = 'selectlist',
        defaults = {

            //榛樿灞炴€ч厤缃�
            enable: true,   //閫夋嫨鍒楄〃鏄惁鍙敤
            zIndex: null,  //閫夋嫨鍒楄〃z-index鍊硷紝濡傞渶鍏煎IE6/7,蹇呴』鍔犳灞炴€�
            width: null,   //閫夋嫨鍒楄〃瀹藉害
            height: null,  //閫夋嫨鍒楄〃楂樺害
            border: null,  //閫夋嫨鍒楄〃杈规
            
            borderRadius: null,  //閫夋嫨鍒楄〃鍦嗚
            showMaxHeight: null,  //閫夋嫨鍒楄〃鏄剧ず鏈€澶ч珮搴�
            optionHeight: 34,   //閫夋嫨鍒楄〃鍗曢」楂樺害
            triangleSize: 6,   //鍙充晶灏忎笁瑙掑ぇ灏�
            triangleColor: '#333',  //鍙充晶灏忎笁瑙掗鑹�

            topPosition: false,  //閫夋嫨鍒楄〃椤瑰湪鍒楄〃妗嗕笂閮ㄦ樉绀�,榛樿鍦ㄤ笅杈规樉绀�
            speed: 100,   //閫夋嫨鍒楄〃妗嗘樉绀哄姩鐢婚€熷害锛堟绉掞級
            onChange: function(){}  //鑷畾涔夋ā鎷熼€夋嫨鍒楄〃椤筩hange浜嬩欢
        };

    function SelectList(element,options){
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    SelectList.prototype={

        init: function(){
            var that = this,
                element = this.element;

            that.replaceProtoypeSelect(element);
            that.setSelectEvent(element);
            that.setSelectStyle(element);
        },

        //鑾峰彇鍘熺敓閫夋嫨鍒楄〃id鍊�
        getSelectID: function(element){
            var $this = $(element),
                selectID = $this.attr('id');

            if(typeof(selectID) !== 'undefined'){
                return selectID;
            }else{
                selectID='';
                return selectID;
            }
        },

        //鑾峰彇鍘熺敓閫夋嫨鍒楄〃name鍊�
        getSelectName: function(element){
            var that = this,
                $this = $(element),
                selectName = $this.attr('name');

            if(typeof(selectName) !== 'undefined'){
                return selectName;
            }else{
                return that.getSelectID($this);
            }
        },

        //鑾峰彇鍘熺敓閫夋嫨鍒楄〃class鍚�
        getSelectClassName: function(element){
            var $this = $(element),
                tempClassNameArray = [],
                classNameArray = [],
                className = $this.attr('class');

            if(typeof(className) !== 'undefined'){
                classNameArray = className.split(' ');
                classNameArray.sort();
                tempClassNameArray =[classNameArray[0]];
                for(var i = 1; i < classNameArray.length; i++){
                    if( classNameArray[i] !== tempClassNameArray[tempClassNameArray.length-1]){
                        tempClassNameArray.push(classNameArray[i]);
                    }
                }
                return tempClassNameArray.join(' ');
            }else{
                className='';
                return className;
            }
        },

        //鑾峰彇鍘熺敓閫夋嫨鍒楄〃閫変腑绱㈠紩鍊�
        getSelectedIndex: function(element){
            var $this = $(element),
                selectedIndex = $this.get(0).selectedIndex || 0;

            return selectedIndex;
        },

        //鑾峰彇鍘熺敓閫夋嫨鍒楄〃option鐨勬暟閲�
        getOptionCount: function(element){
            var $this = $(element);

            return  $this.children().length;
        },

        //鑾峰彇鍘熺敓閫夋嫨鍒楄〃option鐨勫唴瀹�
        getOptionText: function(element){
            var that = this,
                $this = $(element),
                $option = $this.children(),
                optionText = [],
                selectLength = that.getOptionCount($this);

            for(var i=0;i<selectLength;i++){
                optionText[i] = $.trim($option.eq(i).text());
            }
            return optionText;
        },

        //鑾峰彇鍘熺敓閫夋嫨鍒楄〃閫変腑鍊�
        getSelectedOptionText: function(element){
            var that = this,
                $this = $(element),
                selectedIndex = that.getSelectedIndex($this),
                optionText = that.getOptionText($this);

            return optionText[selectedIndex];

        },

        //鑾峰彇鍘熺敓閫夋嫨鍒楄〃閫変腑option鐨剉alue鍊�
        getSelectedOptionValue: function(element){
            var that = this,
                $this = $(element),
                selectedIndex = that.getSelectedIndex($this),
                optionValue = that.getOptionValue($this);

            return optionValue[selectedIndex];
        },

        //鑾峰彇鍘熺敓閫夋嫨鍒楄〃鎵€鏈塷ption鐨剉alue,杩斿洖鏁扮粍
        getOptionValue: function(element){
            var that = this,
                $this = $(element),
                $option = $this.children(),
                optionValue = [],
                selectLength = that.getOptionCount($this);

            for(var i = 0; i < selectLength; i++ ){
                optionValue[i] = $option.eq(i).val();
            }
            return optionValue;
        },

        //鐢熸垚妯℃嫙閫夋嫨鍒楄〃
        renderSelect: function(element){
            var that = this,
                $this = $(element),
                selectID = that.getSelectID($this),
                selectName = that.getSelectName($this),
                selectClassName = that.getSelectClassName($this),
                selectOptionText = that.getOptionText($this),
                selectedOptionText = that.getSelectedOptionText($this),
                selectOptionValue = that.getOptionValue($this),
                selectedIndex = that.getSelectedIndex($this),
                selectedValue = that.getSelectedOptionValue($this),
                selectLength = that.getOptionCount($this),
                selectHTML = '<div id="' + selectID + '" class="select-wrapper ' + selectClassName + '"><input type="hidden" name="' + selectName + '" value="' + selectedValue + '" /><i class="icon select-down"></i><input type="button" class="select-button" value="' + selectedOptionText + '" /><div class="select-list"><ul>',
                selectListHTML = '';

            for(var i=0; i<selectLength; i++){
                if(i !== selectedIndex){
                    selectListHTML = selectListHTML + '<li data-value="' + selectOptionValue[i] + '">' + selectOptionText[i] + '</li>';
                }else{
                    selectListHTML = selectListHTML + '<li data-value="' + selectOptionValue[i] + '" class="selected">' + selectOptionText[i] + '</li>';
                }

            }
            selectHTML = selectHTML + selectListHTML + '</ul></div></div>';

            return selectHTML;
        },

        //鏇挎崲鍘熺敓閫夋嫨鍒楄〃
        replaceProtoypeSelect: function(element){
            var that = this,
                $this = $(element),
                selectHTML = that.renderSelect($this);

            $this.replaceWith(selectHTML);
        },

        //璁剧疆妯℃嫙閫夋嫨鍒楄〃涓嶅彲鐢�
        setSelectDisabled: function(element){
            var that = this,
                $this = $(element),
                selectID = '#' + that.getSelectID($this);

            $(selectID).children('i').addClass('disabled').end()
                .children('.select-button').attr('disabled','disabled');
        },

        //璁剧疆妯℃嫙閫夋嫨鍒楄〃鍙敤
        setSelectEnabled: function(element){
            var that = this,
                $this = $(element),
                selectID = '#' + that.getSelectID($this);

            $(selectID).children('i').removeClass('disabled').end()
                .children('.select-button').removeAttr('disabled');
        },

        //璁剧疆妯℃嫙閫夋嫨鍒楄〃鏍峰紡
        setSelectStyle: function(element){
            var that = this,
                $this = $(element),
                selectID = '#' + that.getSelectID($this),
                selectLength = that.getOptionCount($this);

            //璁剧疆妯℃嫙閫夋嫨鍒楄〃澶栧眰鏍峰紡
            $(selectID).css({
                'z-index': that.setStyleProperty(that.settings.zIndex),
                width: that.setStyleProperty(that.settings.width) - 2 + 'px',
                height: that.setStyleProperty(that.settings.height) + 'px'
            });

            //璁剧疆妯℃嫙閫夋嫨鍒楄〃鍚戜笅绠ご鏍峰紡
            $(selectID).children('.select-down').css({
                top: that.setStyleProperty((that.settings.height - that.settings.triangleSize)/2) + 'px',
                'border-width': that.setStyleProperty(that.settings.triangleSize) + 'px',
                'border-color': that.setStyleProperty(that.settings.triangleColor) + ' transparent transparent transparent'
            });

            //璁剧疆妯℃嫙閫夋嫨鍒楄〃鎸夐挳鏍峰紡
            $(selectID).children('.select-button').css({
                width: function(){
                    if(!that.settings.width){
                        return;
                    }else{
                        return that.settings.width - 2 + 'px';
                    }
                },
                height: that.setStyleProperty(that.settings.height) + 'px',
                border: that.setStyleProperty(that.settings.border),
                'border-radius': that.setStyleProperty(that.settings.borderRadius) + 'px'
            });

            //璁剧疆妯℃嫙閫夋嫨鍒楄〃涓嬫媺澶栧眰鏍峰紡
            $(selectID).children('.select-list').css({
                width:  function(){
                    if(!that.settings.width){
                        return;
                    }else{
                        return that.settings.width - 2 + 'px';
                    }
                },
                'top': function(index,value){
                    if(!that.settings.height){
                        return;
                    }else{
                        if(!that.settings.topPosition){
                            return that.settings.height + 1 + 'px';
                        }else{
                            if(!that.settings.optionHeight){
                                //璁＄畻涓嬫媺鍒楄〃楂樺害
                            }else{
                                return -that.settings.optionHeight*selectLength - 3 + 'px';
                            }
                        }
                    }
                },
                'max-height': that.setStyleProperty(that.settings.showMaxHeight) + 'px'
            });

            //璁剧疆璁剧疆妯℃嫙閫夋嫨鍒楄〃閫夐」澶栧眰鏍峰紡
            $(selectID + ' ul').css({
                'max-height': that.setStyleProperty(that.settings.showMaxHeight) + 'px',
                'line-height': that.setStyleProperty(that.settings.optionHeight) + 'px'
            });

            //璁剧疆妯℃嫙閫夋嫨鍒楄〃閫夐」鏍峰紡
            $(selectID + ' li').css({
                height: that.setStyleProperty(that.settings.optionHeight) + 'px'
            });

        },

        //妫€娴嬫槸鍚﹁缃煇涓牱寮�
        setStyleProperty: function(styleProperty){
            if(!styleProperty){
                return;
            }else{
                return styleProperty;
            }
        },

        //缁戝畾妯℃嫙閫夋嫨鍒楄〃涓€绯诲垪浜嬩欢
        setSelectEvent: function(element){
            var that = this,
                $this = $(element),
                showSpeed = that.settings.speed,
                border = that.settings.border,
                selectID = '#' + that.getSelectID($this),
                selectName = that.getSelectName($this),
                selectedIndex = that.getSelectedIndex($this),
                selectLength = that.getOptionCount($this),
                selectBtn = $(selectID + ' input[type="button"]'),
                selectItem = $(selectID + ' li');

            if(that.settings.enable){
                $(selectID)
                    .click(function(event){
                        event.stopPropagation();
                        $(this).children('.select-list').slideToggle(showSpeed);

                        if(that.settings.border){
                            $(this).css({border:border});
                        }else{
                            $(this).addClass('focus');
                        }

                        $(this).find('li').each(function(){
                            if($(this).text() === selectBtn.val()){
                                $(this).addClass('selected').siblings().removeClass('selected');
                            }
                        })

                    })
                    .on('focusin','input[type="button"]',function(){
                        $('.select-wrapper').children('.select-list').slideUp(showSpeed);
                        if($('.select-wrapper').hasClass('focus')){
                            $('.select-wrapper').removeClass('focus');
                        }
                    })
                    .on('keyup','input[type="button"]',function(event){
                        //缂撳瓨绗竴涓閫変腑鐨勫€�
                        var $selectedItem = $(this).siblings('.select-list').children().children('li.selected');

                        switch(event.keyCode){
                            //Enter
                            case 13:
                                $(this)
                                    .val($selectedItem.text())
                                    .prev().prev().val($selectedItem.attr('data-value'));
                                if ($.isFunction(that.settings.onChange)) {
                                    that.settings.onChange.call(that);
                                }
                                break;
                            //Esc
                            case 27:
                                $(this).siblings('.select-list').slideUp(showSpeed);
                                break;
                            //Up
                            case 38:
                                event.preventDefault();
                                if(selectedIndex !== 0){
                                    $selectedItem.removeClass('selected').prev().addClass('selected');
                                    selectedIndex =  selectedIndex - 1;
                                }else{
                                    $selectItem.last().addClass('selected').siblings().removeClass('selected');
                                    selectedIndex = selectLength - 1;
                                }
                                $selectedItem =  $(this).siblings('.select-list').children().children('li.selected');
                                $(this)
                                    .val($selectedItem.text())
                                    .prev().prev().val($selectedItem.attr('data-value'));
                                break;
                            //Down
                            case 40:
                                event.preventDefault();
                                if(selectedIndex < selectLength - 1 ){
                                    $selectedItem.removeClass('selected').next().addClass('selected');
                                    selectedIndex =  selectedIndex + 1;
                                }else{
                                    $selectItem.first().addClass('selected').siblings().removeClass('selected');
                                    selectedIndex = 0;
                                }
                                $selectedItem =  $(this).siblings('.select-list').children().children('li.selected');
                                $(this)
                                    .val($selectedItem.text())
                                    .prev().prev().val($selectedItem.attr('data-value'));
                                break;
                        }

                    })
                    .children('i').removeClass('disabled').end()
                    .children('.select-button').removeAttr('disabled');

                //缁戝畾鍗曞嚮閫夐」浜嬩欢
                selectItem.on('click',function(event){
                    event.stopPropagation();
                    $(this)
                        .addClass('selected').siblings().removeClass('selected')
                        .parent().parent().slideUp(showSpeed)
                        .prev().val($(this).text())
                        .siblings('input[type="hidden"]').val($(this).attr('data-value'));

                    if($('.select-wrapper').hasClass('focus')){
                        $('.select-wrapper').removeClass('focus');
                    }

                    if($.isFunction(that.settings.onChange)){
                        that.settings.onChange.call(that);
                    }

                    return false;
                }).hover(function(){
                    $(this).addClass('selected').siblings().removeClass('selected');
                }).mouseenter(function(event){
                    var target = event.target,
                        realWidth =  target.offsetWidth,
                        wrapperWidth = target.scrollWidth,
                        text = $(target).text();
                    if(realWidth < wrapperWidth){
                        $(target).attr( "title", text);
                    }
                })

                $(document).on('click',function(){
                    $(this).find('.select-list').slideUp(showSpeed);
                    if($('.select-wrapper').hasClass('focus')){
                        $('.select-wrapper').removeClass('focus');
                    }
                })

            }else{
                $(selectID)
                    .children('i').addClass('disabled').end()
                    .children('.select-button').attr('disabled','disabled');
                return;
            }
        }

    };

    $.fn[pluginName] = function(options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new SelectList(this, options));
                if(!options.topPosition){
                    options.zIndex--;
                }else{
                    options.zIndex++;
                };
            }
        });
        return this;
    };

})(jQuery,window,document);