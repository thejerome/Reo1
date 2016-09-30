package vlab.server_java.calculate;

import com.fasterxml.jackson.databind.ObjectMapper;
import rlcp.calculate.CalculatingResult;
import rlcp.generate.GeneratingResult;
import rlcp.server.processor.calculate.CalculateProcessor;
import vlab.server_java.model.*;
import vlab.server_java.model.tool.ToolModel;

import java.math.BigDecimal;
import java.util.concurrent.TimeUnit;

import static java.math.BigDecimal.ONE;
import static java.math.BigDecimal.ZERO;
import static vlab.server_java.model.util.Util.bd;
import static vlab.server_java.model.util.Util.escapeParam;
import static vlab.server_java.model.util.Util.prepareInputJsonString;

/**
 * Simple CalculateProcessor implementation. Supposed to be changed as needed to provide necessary Calculate method support.
 */
public class CalculateProcessorImpl implements CalculateProcessor {
    @Override
    public CalculatingResult calculate(String condition, String instructions, GeneratingResult generatingResult) {
        //do calculate logic here
        String text = "";
        String code = "";

        try{
            ObjectMapper mapper = new ObjectMapper();

            Solution solution = mapper.readValue(prepareInputJsonString(condition), Solution.class);
            Variant variant = mapper.readValue(prepareInputJsonString(generatingResult.getCode()), Variant.class);

            BigDecimal q = ToolModel.getQ(
                    solution.getDelta_p(),
                    solution.getTube_radius(),
                    variant.getTube_length(),
                    solution.getMu()
            );

            TimeUnit.SECONDS.sleep(4);

            return new CalculatingResult("ok", escapeParam(escapeParam(mapper.writeValueAsString(new ExperimentResult(q)))));

        } catch (Exception e){
            return new CalculatingResult("error", e.toString());
        }

    }
}
