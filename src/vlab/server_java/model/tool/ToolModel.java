package vlab.server_java.model.tool;

import java.math.BigDecimal;
import java.math.RoundingMode;

import static java.lang.Math.*;
import static java.math.BigDecimal.ONE;
import static java.math.BigDecimal.ZERO;
import static java.math.BigDecimal.valueOf;
import static java.math.RoundingMode.*;
import static vlab.server_java.model.util.Util.bd;

/**
 * Created by efimchick on 04.07.16.
 */
public class ToolModel {

    public static BigDecimal getQ(
            BigDecimal delta_p,
            BigDecimal tube_radius,
            BigDecimal tube_length,
            BigDecimal mu
    ){

        BigDecimal dividend = delta_p.multiply(bd(1000)).multiply(bd(Math.PI)).multiply(tube_radius.pow(4));
        BigDecimal divisor = bd(8).multiply(tube_length).multiply(mu);

        if(divisor.compareTo(ZERO) == 0){
            return ZERO;
        }

        return dividend.divide(divisor, HALF_UP);

    }
}
