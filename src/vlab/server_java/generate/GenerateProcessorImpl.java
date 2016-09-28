package vlab.server_java.generate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import rlcp.generate.GeneratingResult;
import rlcp.server.processor.generate.GenerateProcessor;
import vlab.server_java.model.Variant;


import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import static java.lang.Math.PI;
import static java.math.BigDecimal.ROUND_HALF_UP;
import static java.math.BigDecimal.ZERO;
import static java.math.RoundingMode.HALF_DOWN;
import static java.math.RoundingMode.HALF_UP;
import static vlab.server_java.model.tool.ToolModel.*;
import static vlab.server_java.model.util.Util.bd;
import static vlab.server_java.model.util.Util.escapeParam;
import static vlab.server_java.model.util.Util.shrink;

/**
 * Simple GenerateProcessor implementation. Supposed to be changed as needed to
 * provide necessary Generate method support.
 */
public class GenerateProcessorImpl implements GenerateProcessor {


    Random random = new Random(System.nanoTime());
    private static int tauGammaPairsAmount = 8;
    private static int gammaMinStep = 15;
    private static int gammaMaxStep = 35;

    @Override
    public GeneratingResult generate(String condition) {
        ObjectMapper mapper = new ObjectMapper();

        //do Generate logic here
        String text = "Ваш вариант загружен в установку";
        String code = " ";
        String instructions = " ";
        try {
            /*
            int radius_bounds_a = getRandomIntegerBetween(2, 6);
            int radius_bounds_b = radius_bounds_a + radius_bounds_a + 1;
            int mass = getRandomIntegerBetween(1, 5);

            double i = getRandomDoubleBetween(radius_bounds_a / 2, radius_bounds_a);
            double v = getRandomDoubleBetween(mass * 2 + 1, mass * 5);
*/

            //Из пдф-файла. Для радиуса 0.02:0.2 и с шагом 0.01 в метрах, для разницы давления 200:500 с шагом 1 в кПа.

//            0.37 Па.с

            BigDecimal mu = bd(getRandomDoubleBetween(0.01, 1.5));
            BigDecimal tubeLength = bd(getRandomIntegerBetween(10, 100));
            BigDecimal ro = bd(getRandomIntegerBetween(1000, 1500));

            BigDecimal randomTubeRadius = bd(getRandomDoubleBetween(0.1, 0.2));
            BigDecimal randomDelta_p = bd(getRandomDoubleBetween(200, 500));

            BigDecimal needed_Q = getQ(randomDelta_p, randomTubeRadius, tubeLength, mu);

            BigDecimal v_cr = needed_Q.divide(bd(PI).multiply(bd(0.2)), HALF_UP);
            BigDecimal recr = v_cr.multiply(bd(2)).multiply(bd(0.2)).multiply(ro).divide(mu, HALF_UP);





            List<BigDecimal[]> tauGammaPairs = new ArrayList<>(tauGammaPairsAmount);
            int previousGamma = 0;
            int gamma = 0;
            for (int i = 0; i < tauGammaPairsAmount; i++) {
                BigDecimal bdGamma = bd(gamma);
                BigDecimal bdTau = bdGamma.multiply(mu);

                BigDecimal[] tauGammaPair = {bdTau, bdGamma};
                tauGammaPairs.add(tauGammaPair);

                previousGamma = gamma;
                gamma = getRandomIntegerBetween(gammaMinStep, gammaMaxStep) + previousGamma;
            }

            {
                //making deviation

                BigDecimal biggestTau = tauGammaPairs.get(tauGammaPairsAmount - 1)[0];
                BigDecimal smallestTau = tauGammaPairs.get(1)[0];

                List<BigDecimal> tauEPlus = new ArrayList<>(tauGammaPairsAmount);
                List<BigDecimal> tauEMinus = new ArrayList<>(tauGammaPairsAmount);
                tauEPlus.add(ZERO);
                tauEMinus.add(ZERO);

                for (int i = 1; i < tauGammaPairsAmount; i++) {
                    tauEPlus.add(bd(getRandomDoubleBetween(0, 1000)));
                    tauEMinus.add(bd(getRandomDoubleBetween(0, 1000)));
                }

                Collections.sort(tauEMinus);
                Collections.sort(tauEPlus);
                BigDecimal tauEPlusSum = tauEPlus.stream().reduce((a, b) -> a.add(b)).get();
                BigDecimal tauEMinusSum = tauEMinus.stream().reduce((a, b) -> a.add(b)).get();



                for (int i = 1; i < tauGammaPairsAmount; i++) {
                    tauEPlus.set(i, tauEPlus.get(i).divide(tauEPlusSum, HALF_UP));
                    tauEMinus.set(i, tauEMinus.get(i).divide(tauEMinusSum, HALF_UP));
                }

//                BigDecimal totalDeviation = biggestTau.min(
//                        smallestTau.multiply(bd(0.9)).divide(tauEPlus.get(1).subtract(tauEMinus.get(1)), HALF_UP)
//                );

                BigDecimal totalDeviation = biggestTau;

                for (int i = 1; i < tauGammaPairsAmount; i++) {
                    tauEPlus.set(i, tauEPlus.get(i).multiply(totalDeviation));
                    tauEMinus.set(i, tauEMinus.get(i).multiply(totalDeviation));
                }

                for (int i = 1; i < tauGammaPairsAmount; i++) {
                    BigDecimal newTau = tauGammaPairs.get(i)[0].add(tauEPlus.get(i)).subtract(tauEMinus.get(i));
                    if (newTau.compareTo(ZERO) == 1){
                        tauGammaPairs.get(i)[0] = newTau;
                    } else {
                        tauGammaPairs.get(i)[0] = tauGammaPairs.get(i)[0].multiply(bd(0.1));
                    }
                }

                BigDecimal tauSum = tauGammaPairs.stream().map(tg -> tg[0]).reduce((a,b) -> a.add(b)).get();
                BigDecimal gammaSum = tauGammaPairs.stream().map(tg -> tg[1]).reduce((a, b) -> a.add(b)).get();

                mu = shrink(tauSum.divide(gammaSum, HALF_UP));
            }


            Variant variant = new Variant(tauGammaPairs, tubeLength, needed_Q, ro);


            code = mapper.writeValueAsString(variant);
            instructions = mu.toString();
        } catch (JsonProcessingException e) {
            code = "Failed, " + e.getOriginalMessage();
        }

        return new GeneratingResult(text, escapeParam(code), escapeParam(instructions));
    }


    private int getRandomIntegerBetween(int a, int b) {
        return (a + random.nextInt(b - a + 1));
    }

    private double getRandomDoubleBetween(double a, double b) {
        return (a + random.nextDouble() * (b-a));
    }


}
