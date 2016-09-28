function init_lab() {
    var container,
        help_active = false,
        MIN_TUBE_RADIUS = 0.02,
        MAX_TUBE_RADIUS = 0.2,
        MIN_PRESSURE_DROP = 200,
        MAX_PRESSURE_DROP = 500,
        tube_radius = MIN_TUBE_RADIUS,
        pressure_drop = MIN_PRESSURE_DROP,
        viscosity_coefficient = 0,
        default_variant = {
        tau_gamma_values: [
            [0, 0], [34, 7], [65, 25], [78, 39], [88, 45], [98, 56], [120, 61], [132, 74], [152, 88], [170, 95]
        ],
        tube_length: 20,
        needed_Q: 1.2,
        ro: 1.386
    },
        default_calculate_data = {Q: 1.386},
        radius_coefficient,
        pressure_coefficient,
        laboratory_variant,
        timeout_jelly_running,
        window =
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
        '<input type="number" min="0" step="0.001" value="' + viscosity_coefficient + '" class="viscosity_coefficient_value value" />Па&#183;с</label>' +
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
        '<div class="canvas_container"><canvas width="660" height="200px" class="tube_canvas">Браузер не поддерживает canvas</canvas></div>' +
        '<input type="button" class="btn btn_play" value="Запустить" />' +
        '<div class="result_volume">Полученный объёмный расход <i>Q</i>: <span class="result_volume_value value"></span><sup>м<sup>3</sup></sup>/<sub>с</sub></div></div>' +
        '<div class="block_help">Справка</div>' +
        '<div class="block_loading"><div class="waiting_loading"><img width="100%" height="100%" src="img/Lab_dynamic_viscosity_hourglass.png"/></div></div>' +
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

    function draw_tube(canvas_selector, radius_coefficient, pressure_coefficient){
        var canvas = canvas_selector[0];
        var ctx = canvas.getContext("2d");
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#4f5e6d';
        ctx.strokeStyle = '#003300';
        ctx.save();
        ctx.translate(0, 110);
        ctx.fillRect(0, 0, $(".tube_canvas").attr("width"), 15 + 55/100*radius_coefficient);
        ctx.fillStyle = '#003300';
        ctx.fillRect(0, 0, $(".tube_canvas").attr("width"), 5);
        ctx.fillRect(0, 10 + 55/100*radius_coefficient, $(".tube_canvas").attr("width"), 5);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, 10 + 55/100*radius_coefficient);
        ctx.lineTo(55, 5);
        ctx.moveTo(55, 10 + 55/100*radius_coefficient);
        ctx.lineTo(110, 5);
        ctx.moveTo(110, 10 + 55/100*radius_coefficient);
        ctx.lineTo(165, 5);
        ctx.moveTo(165, 10 + 55/100*radius_coefficient);
        ctx.lineTo(220, 5);
        ctx.moveTo(220, 10 + 55/100*radius_coefficient);
        ctx.lineTo(275, 5);
        ctx.moveTo(275, 10 + 55/100*radius_coefficient);
        ctx.lineTo(330, 5);
        ctx.moveTo(330, 10 + 55/100*radius_coefficient);
        ctx.lineTo(385, 5);
        ctx.moveTo(385, 10 + 55/100*radius_coefficient);
        ctx.lineTo(440, 5);
        ctx.moveTo(440, 10 + 55/100*radius_coefficient);
        ctx.lineTo(495, 5);
        ctx.moveTo(495, 10 + 55/100*radius_coefficient);
        ctx.lineTo(550, 5);
        ctx.moveTo(550, 10 + 55/100*radius_coefficient);
        ctx.lineTo(605, 5);
        ctx.moveTo(605, 10 + 55/100*radius_coefficient);
        ctx.lineTo($(".tube_canvas").attr("width"), 5);
        ctx.stroke();
        ctx.restore();
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
        ctx.translate(1.5, -30);
        ctx.fillStyle = '#cccccc';
        ctx.save();
        ctx.rotate(Math.PI/6 + 10*Math.PI/6/100*pressure_coefficient);
        ctx.beginPath();
        ctx.lineTo(1.5, 0);
        ctx.lineTo(1.5, 22);
        ctx.lineTo(0, 24);
        ctx.lineTo(-1.5, 22);
        ctx.lineTo(-1.5, 0);
        ctx.lineTo(0, 0);
        ctx.fill();
        ctx.restore();
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, 2 * Math.PI, false);
        ctx.fillStyle = '#003300';
        ctx.fill();
        ctx.fillStyle = '#de5e5e';
        ctx.beginPath();
        ctx.arc(-13.5, 23.38, 2, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(13.5, 23.38, 2, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, -27, 2, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-27, 0, 2, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(27, 0, 2, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.arc(-13.5, -23.38, 2, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(13.5, -23.38, 2, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-23.38, -13.5, 2, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(23.38, -13.5, 2, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-23.38, 13.5, 2, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(23.38, 13.5, 2, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.restore();
    }

    function run_jelly(canvas_selector, radius_coefficient, jelly_bound) {
        var canvas = canvas_selector[0];
        var ctx = canvas.getContext("2d");
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#f486a0';
        ctx.fillRect(0, 115, jelly_bound, 5 + 55/100*radius_coefficient);
        if (jelly_bound <= $(".tube_canvas").attr("width")){
            timeout_jelly_running = setTimeout(function(){run_jelly(canvas_selector, radius_coefficient, parseInt(jelly_bound)+1)}, 1);
        }
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
                    return x_range(d[1]);
                })
                .y(function (d) {
                    return y_range(d[1]*tangent);
                });
            plot.append("svg:path")
                .datum(data)
                .attr("d", lineFunc)
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
        radius_coefficient = create_radius_coefficient(MIN_TUBE_RADIUS);
        pressure_coefficient = create_pressure_coefficient(MIN_PRESSURE_DROP);
        draw_tube($(".tube_canvas"), radius_coefficient, pressure_coefficient);
    }

    function freeze_installation(){
        $(".block_loading").addClass("active_waiting");
        run_jelly($(".tube_canvas"), radius_coefficient, 10);
    }

    function unfreeze_installation(calculate_data){
        clearTimeout(timeout_jelly_running);
        $(".result_volume").css("visibility", "visible");
        $(".result_volume_value").html(calculate_data.Q);
        draw_tube($(".tube_canvas"), radius_coefficient, pressure_coefficient);
        $(".block_loading").removeClass("active_waiting");
    }
    
    function launch() {
        freeze_installation();
        ANT.calculate();
    }

    function parse_result(str, default_object) {
        var parse_str;
        if (typeof str === 'string' && str !== "") {
            try {
                parse_str = str.replace(/<br\/>/g, "\r\n").replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&lt;br\/&gt;/g, "\r\n")
                    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&minus;/g, "-").replace(/&apos;/g, "\'").replace(/&#0045;/g, "-");
                parse_str = JSON.parse(parse_str);
            } catch (e) {
                if (default_object){
                    parse_str = default_object;
                } else {
                    parse_str = false;
                }
            }
        } else {
            if (default_object){
                parse_str = default_object;
            } else {
                parse_str = false;
            }
        }
        return parse_str;
    }

    function get_variant() {
        var variant;
        if ($("#preGeneratedCode") !== null) {
            variant = parse_result($("#preGeneratedCode").val(), default_variant);
        } else {
            variant = default_variant;
        }
        return variant;
    }

    function draw_previous_solution(previous_solution) {
        $(".control_tube_radius_slider").val(previous_solution.tube_radius);
        change_tube_radius_value();
        radius_coefficient = create_radius_coefficient($(".control_tube_radius_slider").val());
        $(".control_pressure_drop_slider").val(previous_solution.delta_p);
        change_pressure_drop_value();
        pressure_coefficient = create_pressure_coefficient($(".control_pressure_drop_slider").val());
        draw_tube($(".tube_canvas"), radius_coefficient, pressure_coefficient);
        $(".viscosity_coefficient_value").val(previous_solution.mu);
        viscosity_coefficient = previous_solution.mu;
        init_plot(laboratory_variant.tau_gamma_values, ".block_viscosity_plot svg",
            $(".block_viscosity_plot svg").attr("width"), $(".block_viscosity_plot svg").attr("height"), viscosity_coefficient);
    }

    function create_radius_coefficient(current_radius){
        var coefficient;
        coefficient = (current_radius-MIN_TUBE_RADIUS)*100/(MAX_TUBE_RADIUS-MIN_TUBE_RADIUS);
        return coefficient;
    }

    function create_pressure_coefficient(current_pressure){
        var coefficient;
        coefficient = (current_pressure-MIN_PRESSURE_DROP)*100/(MAX_PRESSURE_DROP-MIN_PRESSURE_DROP);
        return coefficient;
    }

    return {
        init: function () {
            laboratory_variant = get_variant();
            container = $("#jsLab")[0];
            container.innerHTML = window;
            fill_installation(laboratory_variant);
            if ($("#previousSolution") !== null && $("#previousSolution").length > 0 && parse_result($("#previousSolution").val())) {
                var previous_solution = parse_result($("#previousSolution").val());
                draw_previous_solution(previous_solution);
            }
            $(".btn_help").click(function () {
                show_help();
            });
            $(".control_tube_radius_slider").change(function () {
                change_tube_radius_value();
                radius_coefficient = create_radius_coefficient($(this).val());
                draw_tube($(".tube_canvas"), radius_coefficient, pressure_coefficient);
            });
            $(".control_pressure_drop_slider").change(function () {
                change_pressure_drop_value();
                pressure_coefficient = create_pressure_coefficient($(this).val());
                draw_tube($(".tube_canvas"), radius_coefficient, pressure_coefficient);
            });
            $(".control_tube_radius_value").change(function () {
                if ($(this).val() < MIN_TUBE_RADIUS) {
                    $(this).val(MIN_TUBE_RADIUS)
                } else if($(this).val() > MAX_TUBE_RADIUS){
                    $(this).val(MAX_TUBE_RADIUS)
                }
                change_tube_radius_slider();
                radius_coefficient = create_radius_coefficient($(this).val());
                draw_tube($(".tube_canvas"), radius_coefficient, pressure_coefficient);
            });
            $(".control_pressure_drop_value").change(function () {
                if ($(this).val() < MIN_PRESSURE_DROP) {
                    $(this).val(MIN_PRESSURE_DROP)
                } else if($(this).val() > MAX_PRESSURE_DROP){
                    $(this).val(MAX_PRESSURE_DROP)
                }
                change_pressure_drop_slider();
                pressure_coefficient = create_pressure_coefficient($(this).val());
                draw_tube($(".tube_canvas"), radius_coefficient, pressure_coefficient);
            });
            $(".btn_play").click(function () {
                launch();
            });
            $(".viscosity_coefficient_value").change(function () {
                if ($(this).val() <= 0) {
                    $(this).val(0)
                }
                viscosity_coefficient = $(this).val();
                init_plot(laboratory_variant.tau_gamma_values, ".block_viscosity_plot svg",
                    $(".block_viscosity_plot svg").attr("width"), $(".block_viscosity_plot svg").attr("height"), $(this).val());
            });
        },
        calculateHandler: function () {
            var calculate_data = parse_result(arguments[0], default_calculate_data);
            unfreeze_installation(calculate_data);
        },
        getResults: function () {
            var answer = {mu: viscosity_coefficient, delta_p: pressure_drop, tube_radius: tube_radius};
            return JSON.stringify(answer);
        },
        getCondition: function () {
            var condition = {mu: viscosity_coefficient, delta_p: pressure_drop, tube_radius: tube_radius};
            return JSON.stringify(condition);
        }
    }
}

var Vlab = init_lab();