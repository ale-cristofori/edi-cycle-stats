
<?php
require "graphqlPHP/autoload.php";
require_once('DB.php');
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use GraphQL\GraphQL;

try {
    
    $severity_map = array(
        'fatal' => 1,
        'serious' => 2,
        'slight' => 3
    );
    
    $pointGeom = new ObjectType([
        'name' => 'geometry',
        'fields' => [
            'type' => ['type' => Type::string() ],
            'coordinates' => [ 'type' => Type::listOf(Type::float())],
        ]
    ]);
    
    $properties = new ObjectType([
       'name' => 'properties',
       'fields' => [
            'id' => ['type' => Type::string() ],
            'year' => [ 'type' => Type::int() ],
            'casualty_severity' => ['type' => Type::string()]
        ]
    ]);
    
    
    $featureType = new ObjectType([
        'name' => 'pointFeature',
        'fields' => [
            'type' => ['type' => Type::string() ],
            'geometry' => $pointGeom,
            'properties' => $properties
        ],
    ]);
	
	$accidentType = new ObjectType([
        'name' => 'Accident',
        'fields' => [
			'id' => [ 'type' => Type::string() ],
			'x_world_mercator' => [ 'type' => Type::float() ],
			'y_world_mercator' => [ 'type' => Type::float() ],
			'year' => [ 'type' => Type::int() ],
			'casualty_severity' =>['type' => Type::string()]
        ],
    ]);
    
    $geoJsonAccident = new ObjectType([
        'name' => 'GeoJsonAccident',
        'fields' => [
            'id' => [ 'type' => Type::string() ],
			'coords' => [ 'type' => Type::listOf(Type::float())],
			'year' => [ 'type' => Type::int() ],
			'casualty_severity' =>['type' => Type::string()]
            ],
        ]);
	
	$config = [
		'host' => '89.46.111.34',
		'database' => 'Sql1044625_2',
		'username' => 'Sql1044625',
		'password' => '1m5s33g7q5'
    ];
    
	DB::init($config);
	
	$conn = new mysqli('89.46.111.34', 'Sql1044625', '1m5s33g7q5', 'Sql1044625_2');
	
	// Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

	$queryType = new ObjectType([
    'name' => 'Query',
    'fields' => [
        'accidents' => [
            'type' => Type::listOf($featureType),
            'args' => [
                'year' => Type::listOf(Type::int()),
                'severity' => Type::listOf(Type::string()),
                'geom' => Type::listOf(Type::float())
            ],
            'resolve' => function ($root, $args) {
                $years = $args['year'] === null ? join(',' , range(2005,2017,1)) : join(',' , $args['year']);
                //$args['severity'] = [1];
                if ($args['severity'] === null) {
                    $severity = join(',' , range(1,3,1));
                } else {
                        $severity_map = array(
                            'fatal' => 1,
                            'serious' => 2,
                            'slight' => 3
                            );
                    foreach($args['severity'] as &$value) {
                        $value =  $severity_map[strtolower($value)];
                    }
                    unset($value);
                    $severity = join(',' , $args['severity']);
                }
                $results = DB::select("SELECT `Accident_Index` AS id,`x_world_mercator`,`y_world_mercator`, CAST(RIGHT(`Date`, 4) AS UNSIGNED) AS year, CASE WHEN `casualty_severity` = 3 THEN 'Slight'
							    WHEN `casualty_severity` = 2 THEN 'Serious'
							    WHEN `casualty_severity` = 1 THEN 'Fatal'
								ELSE 'Not recorded'
							END AS casualty_severity
							FROM cycling_accidents_05_17
	                        WHERE CAST(RIGHT(`Date`, 4) AS UNSIGNED) IN (".$years. ")
	                        AND `casualty_severity` IN (".$severity.")");
				if ($results > 0) {
               foreach($results as $row) {
                    $rows[] = array(
                    'type' => 'Feature',
                    'geometry' => array(
                        'type' => 'Point',
                        'coordinates' => array(
                           $row->x_world_mercator,
                            $row->y_world_mercator
                        )
                    ),
                    "properties" => array(
            			'id' => $row->id,
            			'year' => $row->year,
            			'casualty_severity'=> $row->casualty_severity,
            			)
                    );
                }
                return $rows;
            } else {
                echo "0 results";
            }
            }
        ],
        
        
        'accidentsYear' => [
            'type' => Type::listOf($accidentType),
            'args' => [
                'year' => Type::nonNull(Type::int()),
            ],
            'resolve' => function ($root, $args) {
                return DB::select("SELECT `Accident_Index` AS id,`x_world_mercator`,`y_world_mercator`, CAST(RIGHT(`Date`, 4) AS UNSIGNED) AS year, CASE WHEN `casualty_severity` = 3 THEN 'Slight'
							    WHEN `casualty_severity` = 2 THEN 'Serious'
							    WHEN `casualty_severity` = 1 THEN 'Fatal'
								ELSE 'Not recorded'
							END AS casualty_severity
							FROM cycling_accidents_05_17
							WHERE CAST(RIGHT(`Date`, 4) AS UNSIGNED) = "
							. $args['year']);
            }
        ],
        
        
        'accident' => [
            'type' => Type::listOf($geoJsonAccident),
            'resolve' => function($root, $args) {
             $conn = new mysqli('89.46.111.34', 'Sql1044625', '1m5s33g7q5', 'Sql1044625_2');
                $sql = "SELECT `Accident_Index` AS id,`x_world_mercator`,`y_world_mercator`, CAST(RIGHT(`Date`, 4) AS UNSIGNED) AS year, CASE WHEN `casualty_severity` = 3 THEN 'Slight'
							    WHEN `casualty_severity` = 2 THEN 'Serious'
							    WHEN `casualty_severity` = 1 THEN 'Fatal'
								ELSE 'Not recorded'
							END AS casualty_severity
							FROM cycling_accidents_05_17";
                $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    $rows[] = array(
                    'id' => $row["id"],
                    'coords' => [$row["x_world_mercator"], $row["y_world_mercator"]],
                    'year' => $row["year"],
                    'casualty_severity' => $row["casualty_severity"]
                    );
                }
                return $rows;
            } else {
                echo "0 results";
            }
            }
        ]
    ],
]);
	
    // See docs on schema options:
    // http://webonyx.github.io/graphql-php/type-system/schema/#configuration-options
    $schema = new Schema([
        'query' => $queryType
    ]);
    //takes the json input {"query":"query{echo(messge)}"}
    $rawInput = file_get_contents('php://input');
    //decodes the content as JSON
    $input = json_decode($rawInput, true);
    //takes the "query" property of the object
    $query = $input['query'];
    //checks if the input variables are a set
    $variableValues = isset($input['variables']) ? $input['variables'] : null;
    //determines the root value
    $rootValue = ['prefix' => 'You said: '];
    //calls the graphQL PHP libraty execute query with the prepared variables
    $result = GraphQL::executeQuery($schema, $query);
    //converts the result to a PHP array
    $output = $result->toArray();
} catch (\Exception $e) {
    $output = [
        'error' => [
            'message' => $e->getMessage()
        ]
    ];
}
header('Content-Type: application/json; charset=UTF-8');
//encodes the result in a JSON object and responds
echo json_encode($output);