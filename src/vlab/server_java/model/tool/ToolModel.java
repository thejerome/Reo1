package vlab.server_java.model.tool;

import java.math.BigDecimal;
import java.math.RoundingMode;

import static java.lang.Math.*;
import static java.math.BigDecimal.ONE;
import static java.math.BigDecimal.valueOf;
import static java.math.RoundingMode.*;
import static vlab.server_java.model.util.Util.bd;

/**
 * Created by efimchick on 04.07.16.
 */
public class ToolModel {

    public static final BigDecimal TEN_POW_MINUS_NINE = new BigDecimal("0.000000001");
    public static final BigDecimal TEN_POW_MINUS_THREE = new BigDecimal("0.001");
    public static final BigDecimal bdPI = new BigDecimal(PI);
    private static BigDecimal halfWidth = bd("0.03");
    private static BigDecimal xStep = bd("0.00025");
    private static final BigDecimal i0 = ONE;

    public static BigDecimal getQ(
            BigDecimal delta_p,
            BigDecimal tube_radius,
            BigDecimal tube_length,
            BigDecimal mu
    ){

        return delta_p.multiply(bd(1000)).multiply(bd(Math.PI)).multiply(tube_radius.pow(4))
                .divide(bd(8).multiply(tube_length).multiply(mu), HALF_UP);

    }
}
