/*
define([
    'third/dat.gui.min'
], function(){
    return dat.controllers.PointListController = (function(Controller, dom, common) {
        console.log('ddd ' + dat.controllers.factory)
        //some sort of visitor factory pattern thingy, no knowledge of the dat.gui internals so probably not a good pattern to reuse.
        var _factory = dat.controllers.factory;
        dat.controllers.factory = function(object, property) {
            console.log('fac?')
            var initialValue = object[property];
            if(initialValue instanceof Array && initialValue.length > 0 && typeof initialValue[0]['x'] === 'number' &&  typeof initialValue[0]['y'] === 'number'){
                return new dat.controllers.PointListController(object, property);
            } else {
                return _factory(object, property)
            }
        }

        console.log('ddd2 ' + dat.controllers.factory)



        var PointListController = function(object, property) {
            console.log(' im alive !')
            PointListController.superclass.call(this, object, property);
            this.__xInputs = [];
            this.__yInputs = [];
            this.updateDisplay();
        };

        PointListController.superclass = Controller;

        common.extend(
            PointListController.prototype,
            Controller.prototype,

            {
                updateDisplay: function() {
                    console.log('updateDisplay;')
                    var w = window,
                        d = document,
                        e = d.documentElement,
                        g = d.getElementsByTagName('body')[0],
                        x = w.innerWidth || e.clientWidth || g.clientWidth,
                        y = w.innerHeight || e.clientHeight || g.clientHeight;

                    this.__xInputs = [];
                    this.__yInputs = [];

                    var _this = this;

                    function onChange() {
                        var r = _this.getValue();
                        r[parseInt(RegExp(/\[(\d)\]/g).exec(this.id)[1])][RegExp(/\]\.(x|y)/g).exec(this.id)[1]] = this.value;
                        _this.setValue(r);
                    }

                    function onBlur() {
                        if (_this.__onFinishChange) {
                            _this.__onFinishChange.call(_this, _this.getValue());
                        }
                    }

                    setTimeout(function() {
                        var titleLI = _this.__gui.__ul.firstChild;
                        while (_this.__gui.__ul.firstChild) {
                            _this.__gui.__ul.removeChild(_this.__gui.__ul.firstChild);
                        }
                        _this.__gui.__ul.appendChild(titleLI);

                        for (var i = 0; i < _this.object[_this.property].length; i++) {
                            var __li = document.createElement('li');
                            _this.__gui.__ul.appendChild(__li);

                            var name = document.createElement('span');
                            dom.addClass(name, 'property-name');
                            name.innerHTML = _this.property + '[' + i + ']';

                            var container = document.createElement('div');
                            container.appendChild(name);

                            var __labelX = document.createElement('label');
                            __labelX.setAttribute('for', _this.property + '[' + i + '].x');
                            __labelX.innerHTML = 'x ';

                            dom.addClass(__labelX, 'label');

                            var __inputX = document.createElement('input');
                            __inputX.setAttribute('type', 'text');
                            __inputX.setAttribute('id', _this.property + '[' + i + '].x');
                            __inputX.value = _this.getValue()[i].x;
                            __inputXContainer = document.createElement('div');
                            __inputXContainer.appendChild(__inputX);
                            _this.__xInputs.push(__inputX)


                            dom.bind(__inputX, 'keyup', onChange);
                            dom.bind(__inputX, 'change', onChange);
                            dom.bind(__inputX, 'blur', onBlur);
                            dom.bind(window, 'splineChange', function() {
                                _this.updateDisplay();
                            });


                            __labelY = document.createElement('label');
                            __labelY.setAttribute('for', _this.property + '[' + i + '].y');
                            __labelY.innerHTML = 'y ';

                            dom.addClass(__labelY, 'label');

                            __inputY = document.createElement('input');
                            __inputY.setAttribute('type', 'text');
                            __inputY.setAttribute('id', _this.property + '[' + i + '].y');
                            __inputY.value = _this.getValue()[i].y;
                            __inputYContainer = document.createElement('div');
                            __inputYContainer.appendChild(__inputY);

                            _this.__yInputs.push(__inputY)

                            dom.bind(__inputY, 'keyup', onChange);
                            dom.bind(__inputY, 'change', onChange);
                            dom.bind(__inputY, 'blur', onBlur);

                            container.appendChild(__labelX);
                            container.appendChild(__inputXContainer);
                            container.appendChild(__labelY);
                            container.appendChild(__inputYContainer);

                            __li.appendChild(container);

                            dom.addClass(__li, dat.GUI.CLASS_CONTROLLER_ROW);
                            dom.addClass(__li, 'point-list-item');

                            dom.addClass(__inputXContainer, 'c');
                            dom.addClass(__inputYContainer, 'c');

                            common.extend(__inputXContainer.style, {
                                float: 'left',
                                width: '50px',
                                marginRight: '10px'
                            });

                            common.extend(__inputX.style, {
                                width: '50px',
                            });

                            common.extend(__labelX.style, {
                                float: 'left',
                                'marginRight': '10px',
                                color: '#838383'
                            });

                            common.extend(__labelY.style, {
                                float: 'left',
                                'marginRight': '10px',
                                color: '#838383'
                            });

                            common.extend(__inputYContainer.style, {
                                float: 'left',
                                width: '50px',
                            });

                            common.extend(__inputY.style, {
                                width: '50px',
                            });
                        }

                        _this.__gui.onResize();
                    }, 250);

                    return PointListController.superclass.prototype.updateDisplay.call(this);
                }
            }
        );

        return PointListController;

    })(dat.controllers.Controller,
        dat.dom.dom,
        dat.utils.common);
})

*/