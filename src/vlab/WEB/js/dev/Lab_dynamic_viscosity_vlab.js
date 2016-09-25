function init_lab() {
    var container;
    var previous_solution;
    var help_active = false;
    var MIN_TUBE_RADIUS = 0.02;
    var MAX_TUBE_RADIUS = 0.2;
    var MIN_PRESSURE_DROP = 200;
    var MAX_PRESSURE_DROP = 500;
    var tube_radius = MIN_TUBE_RADIUS;
    var pressure_drop = MIN_PRESSURE_DROP;
    var default_var = {
        tau_gamma_values: [
            [0, 0], [34, 7], [65, 25], [78, 39], [88, 45], [98, 56], [120, 61], [132, 74], [152, 88], [170, 95]
        ],
        tube_length: 20,
        needed_Q: 1.2,
        ro: 1.386
    };
    var default_calculate_data;
    var lab_var;
    var window =
        '<div class="vlab_setting">' +
        '<div class="block_title">' +
        '<div class="vlab_name">Виртуальная лаборатория «Коэффициент динамической вязкости»</div>' +
        '<input class="btn_help btn" type="button" value="Справка"/></div>' +
        '<div class="block_viscosity_plot"><svg width="450" height="220"></svg></div>' +
        '<div class="block_control">' +
        '<div class="control_tube_length">Длина трубы <i>l</i>:<span class="tube_length_value value"></span>м</div>' +
        '<div class="control_density">Плотность &#961;:<span class="density_value value"></span><sup>кг</sup>/<sub>м<sup>3</sup></sub></div>' +
        '<div class="control_needed_volume">Требуемый объёмный расход <i>Q</i>: <span class="needed_volume_value value"></span><sup>м<sup>3</sup></sup>/<sub>с</sub></div>' +
        '<label class="control_viscosity_coefficient">Коэффициент динамической вязкости жидкости &#956;: ' +
        '<input type="number" step="0.001" value="0" class="viscosity_coefficient_value value" />Па&#183;с</label>' +
        '</div>' +
        '<div class="block_viscosity_table"><table><tbody><tr><td>Напряжение сдвига &#964;<sub>i</sub>, Па</td></tr><tr><td>Скорость сдвига &#947;<sub>i</sub>, с<sup>-1</sup></td></tr></tbody></table></div>' +
        '<div class="block_tube_installation"><div class="tube_installation_control">' +
        '<div><label for="control_tube_radius_slider">Радиус трубы <i>r</i>:</label><input class="control_tube_radius_slider" id="control_tube_radius_slider" type="range" ' +
        'step="0.01" value="' + MIN_TUBE_RADIUS + '" min="' + MIN_TUBE_RADIUS + '" max="' + MAX_TUBE_RADIUS + '"/>' +
        '<input class="control_tube_radius_value value" value="' + MIN_TUBE_RADIUS + '" min="' + MIN_TUBE_RADIUS + '" max="' + MAX_TUBE_RADIUS + '" type="number" step="0.01"/>м' +
        '</div><div><label for="control_pressure_drop_slider">Перепад давлений <i>p</i>:</label><input class="control_pressure_drop_slider" id="control_pressure_drop_slider" type="range" ' +
        'step="1" value="' + MIN_PRESSURE_DROP + '" min="' + MIN_PRESSURE_DROP + '" max="' + MAX_PRESSURE_DROP + '"/>' +
        '<input class="control_pressure_drop_value value" value="' + MIN_PRESSURE_DROP + '" min="' + MIN_PRESSURE_DROP + '" max="' + MAX_PRESSURE_DROP + '" type="number" step="1"/>кПа' +
        '</div></div>' +
        '<div class="canvas_container"><canvas width="660px" height="200px" class="tube_canvas">Браузер не поддерживает canvas</canvas></div>' +
        '<input type="button" class="btn btn_play" value="Запустить" />' +
        '<div class="result_volume">Полученный объёмный расход <i>Q</i>: <span class="result_volume_value value"></span><sup>м<sup>3</sup></sup>/<sub>с</sub></div></div>' +
        '<div class="block_help">Справка</div>' +
        '</div>';

    function show_help() {
        if (!help_active) {
            help_active = true;
            $(".block_help").css("display", "block");
            $(".btn_help").attr("value", "Вернуться");
        } else {
            help_active = false;
            $(".block_help").css("display", "none");
            $(".btn_help").attr("value", "Справка");
        }
    }

    function draw_tube(canvas_selector){
        var canvas = canvas_selector[0];
        var ctx = canvas.getContext("2d");
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#4f5e6d';
        ctx.strokeStyle = '#000000';
        ctx.save();
        ctx.translate(0, 110);
        ctx.fillRect(0, 0, 660, 60);
        ctx.translate(610, -20);
        ctx.fillStyle = '#003300';
        ctx.fillRect(0, 0, 3, 20);
        ctx.beginPath();
        ctx.arc(1.5, -30, 30, 0, 2 * Math.PI, false);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
        ctx.translate(0.5, -30);
        ctx.fillStyle = '#cccccc';
        ctx.fillRect(0, 0, 2, 23);
        ctx.beginPath();
        ctx.arc(1, 0, 4, 0, 2 * Math.PI, false);
        ctx.fillStyle = '#003300';
        ctx.fill();
        ctx.translate(0, 25);
        ctx.fillStyle = '#de5e5e';
        ctx.fillRect(0, 0, 2, 3);
        ctx.translate(-27, -25);
        ctx.fillRect(0, 0, 3, 2);
        ctx.translate(27, -25);
        ctx.fillRect(0, 0, 2, -3);
        ctx.translate(27, 25);
        ctx.fillRect(0, 0, 3, 2);
        ctx.restore();
    }

    function change_tube_radius_value() {
        $(".control_tube_radius_value").val($(".control_tube_radius_slider").val());
        tube_radius = $(".control_tube_radius_slider").val();
    }

    function change_pressure_drop_value() {
        $(".control_pressure_drop_value").val($(".control_pressure_drop_slider").val());
        pressure_drop = $(".control_pressure_drop_slider").val();
    }

    function change_tube_radius_slider() {
        $(".control_tube_radius_slider").val($(".control_tube_radius_value").val());
        tube_radius = $(".control_tube_radius_value").val();
    }

    function change_pressure_drop_slider() {
        $(".control_pressure_drop_slider").val($(".control_pressure_drop_value").val());
        pressure_drop = $(".control_pressure_drop_value").val();
    }

    function init_plot(data, plot_selector, width, height, tangent) {
        $(plot_selector).empty();
        var plot = d3.select(plot_selector),
            MARGINS = {
                top: 20,
                right: 20,
                bottom: 20,
                left: 50
            },
            x_range = d3.scale.linear().range([MARGINS.left, width - MARGINS.right]).domain([d3.min(data, function (d) {
                return d[1];
            }),
                d3.max(data, function (d) {
                    return d[1];
                })
            ]),
            y_range = d3.scale.linear().range([height - MARGINS.top, MARGINS.bottom]).domain([d3.min(data, function (d) {
                return d[0];
            }),
                d3.max(data, function (d) {
                    return d[0];
                })
            ]),
            x_axis = d3.svg.axis()
                .scale(x_range)
                .tickSize(5)
                .tickSubdivide(true),
            y_axis = d3.svg.axis()
                .scale(y_range)
                .tickSize(5)
                .orient("left")
                .tickSubdivide(true);
        plot.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height - MARGINS.bottom) + ")")
            .call(x_axis);
        plot.append("svg:g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (MARGINS.left) + ",0)")
            .call(y_axis);
        plot.selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 3)
            .attr("cx", function(d) { return x_range(d[1]); })
            .attr("cy", function(d) { return y_range(d[0]); })
            .style("fill", "#248118");
        plot.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(35, 22)")
            .style("font-size","24px")
            .html("&#964;");
        plot.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "translate("+ (width-10) +","+(height-10)+")")
            .style("font-size","22px")
            .html("&#947;");
        if (tangent) {
            var lineFunc = d3.svg.line()
                .x(function (d) {
                    return x_range(d[0]);
                })
                .y(function (d) {
                    return x_range(d[0]) * tangent;
                })
                .interpolate('basis');
            plot.append("svg:path")
                .attr("d", lineFunc(data))
                .attr("stroke", "blue")
                .attr("stroke-width", 2)
                .attr("fill", "none");
        }
    }

    function fill_installation(generate_data) {
        $(".tube_length_value").html(generate_data.tube_length);
        $(".density_value").html(generate_data.ro);
        $(".needed_volume_value").html(generate_data.needed_Q);
        init_plot(generate_data.tau_gamma_values, ".block_viscosity_plot svg",
            $(".block_viscosity_plot svg").attr("width"), $(".block_viscosity_plot svg").attr("height"));
        for (var i=0; i < generate_data.tau_gamma_values.length; i++){
            $(".block_viscosity_table tr:first-child").append("<td>" + generate_data.tau_gamma_values[i][0] + "</td>");;
            $(".block_viscosity_table tr:nth-child(2)").append("<td>" + generate_data.tau_gamma_values[i][1] + "</td>");;
        }
        draw_tube($(".tube_canvas"));
    }
    
    function launch() {
        // ANT.calculate();
    }

    function parse_variant(str, def_obj) {
        var parse_str;
        if (typeof str === 'string' && str !== "") {
            try {
                parse_str = str.replace(/&quot;/g, "\"");
                parse_str = JSON.parse(parse_str);
            } catch (e) {
                parse_str = def_obj;
            }
        } else {
            parse_str = def_obj;
        }
        return parse_str;
    }

    function parse_calculate_results(str, def_obj) {
        var parse_str;
        if (typeof str === 'string' && str !== "") {
            try {
                parse_str = str.replace(/<br\/>/g, "\r\n").replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&lt;br\/&gt;/g, "\r\n")
                    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&minus;/g, "-").replace(/&apos;/g, "\'").replace(/&#0045;/g, "-");
                parse_str = JSON.parse(parse_str);
                parse_str = parse_str.table;
            } catch (e) {
                parse_str = def_obj;
            }
        } else {
            parse_str = def_obj;
        }
        return parse_str;
    }

    function get_variant() {
        var variant;
        if ($("#preGeneratedCode") !== null) {
            variant = parse_variant($("#preGeneratedCode").val(), default_var);
        } else {
            variant = default_var;
        }
        return variant;
    }

    function draw_previous_solution() {

    }

    return {
        init: function () {
            lab_var = get_variant();
            container = $("#jsLab")[0];
            container.innerHTML = window;
            fill_installation(lab_var);
            $(".btn_help").click(function () {
                show_help();
            });
            $(".control_tube_radius_slider").change(function () {
                change_tube_radius_value();
            });
            $(".control_pressure_drop_slider").change(function () {
                change_pressure_drop_value();
            });
            $(".control_tube_radius_value").change(function () {
                if ($(this).val() < MIN_TUBE_RADIUS) {
                    $(this).val(MIN_TUBE_RADIUS)
                } else if($(this).val() > MAX_TUBE_RADIUS){
                    $(this).val(MAX_TUBE_RADIUS)
                }
                change_tube_radius_slider();
            });
            $(".control_pressure_drop_value").change(function () {
                if ($(this).val() < MIN_PRESSURE_DROP) {
                    $(this).val(MIN_PRESSURE_DROP)
                } else if($(this).val() > MAX_PRESSURE_DROP){
                    $(this).val(MAX_PRESSURE_DROP)
                }
                change_pressure_drop_slider();
            });
            $(".btn_play").click(function () {
                launch();
            });
            $(".viscosity_coefficient_value").change(function () {
                init_plot(lab_var.tau_gamma_values, ".block_viscosity_plot svg",
                    $(".block_viscosity_plot svg").attr("width"), $(".block_viscosity_plot svg").attr("height"), $(this).val());
            })
        },
        calculateHandler: function () {
            lab_animation_data = parse_calculate_results(arguments[0], default_calculate_data);
        },
        getResults: function () {
            var answer = {};
            return JSON.stringify(answer);
        },
        getCondition: function () {
            var condition = {};
            return JSON.stringify(condition);
        }
    }
}

var Vlab = init_lab();