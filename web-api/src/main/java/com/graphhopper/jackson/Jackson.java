/*
 *  Licensed to GraphHopper GmbH under one or more contributor
 *  license agreements. See the NOTICE file distributed with this work for
 *  additional information regarding copyright ownership.
 *
 *  GraphHopper GmbH licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except in
 *  compliance with the License. You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.graphhopper.jackson;

import com.bedatadriven.jackson.datatype.jts.JtsModule;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.module.afterburner.AfterburnerModule;

public class Jackson {
    public static ObjectMapper initObjectMapper(ObjectMapper objectMapper) {
        objectMapper.registerModule(new GraphHopperModule());
        objectMapper.registerModule(new JtsModule());
        // See https://github.com/FasterXML/jackson-modules-base/issues/37
        objectMapper.registerModule(new AfterburnerModule().setUseValueClassLoader(false));
        return objectMapper;
    }

    public static ObjectMapper newObjectMapper() {
        return initObjectMapper(io.dropwizard.jackson.Jackson.newObjectMapper());
    }
}